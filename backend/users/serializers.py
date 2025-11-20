# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import VendorProfile, CustomerProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "is_verified"]


# -------------------------
# Signup serializers
# -------------------------
class CustomerSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            role=User.Roles.CUSTOMER,
            password=validated_data["password"],
        )
        return user


class VendorSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    shop_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "shop_name"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_shop_name(self, value):
        if VendorProfile.objects.filter(shop_name__iexact=value).exists():
            raise serializers.ValidationError("Shop name already taken.")
        return value

    def create(self, validated_data):
        shop_name = validated_data.pop("shop_name")
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            role=User.Roles.VENDOR,
            password=validated_data["password"],
        )
        # VendorProfile is auto-created via signal; update shop_name & set PENDING
        vp = VendorProfile.objects.get(user=user)
        vp.shop_name = shop_name
        vp.approval_status = "PENDING"
        vp.save()
        return user


# -------------------------
# Login serializer (email + password)
# -------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # Manually fetch user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        # Check password hash
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        # Attach user to validated data
        attrs["user"] = user
        return attrs


# -------------------------
# Profile serializer (GET/PUT)
# -------------------------
class ProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def update(self, instance, validated_data):
        new_email = validated_data.get("email", instance.email)
        new_password = validated_data.get("password", None)

        if new_email and new_email.lower() != (instance.email or "").lower():
            instance.pending_email = new_email
            instance.email_verified = False
            # flag to view that verification email should be sent
            self.context["verification_needed"] = True

        instance.username = validated_data.get("username", instance.username)

        if new_password:
            instance.set_password(new_password)

        instance.save()
        return instance


# -------------------------
# Password update serializer
# -------------------------
class PasswordUpdateSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(write_only=True)
    newPassword = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        current_password = attrs.get("currentPassword")
        new_password = attrs.get("newPassword")

        if not user.check_password(current_password):
            raise serializers.ValidationError({"currentPassword": "Current password is incorrect."})

        if current_password == new_password:
            raise serializers.ValidationError({"newPassword": "New password cannot be same as old password."})

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        new_password = self.validated_data["newPassword"]
        user.set_password(new_password)
        user.save()
        return user


# -------------------------
# Admin (vendor list) serializer (read-only)
# -------------------------
class AdminVendorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    shop_name = serializers.CharField(allow_blank=True)
    shop_slug = serializers.CharField(allow_blank=True)
    approval_status = serializers.CharField()
    logo = serializers.CharField(allow_null=True)
    banner = serializers.CharField(allow_null=True)


# -------------------------
# Upload serializers
# -------------------------
class UploadLogoSerializer(serializers.Serializer):
    logo = serializers.ImageField()

class UploadBannerSerializer(serializers.Serializer):
    banner = serializers.ImageField()
