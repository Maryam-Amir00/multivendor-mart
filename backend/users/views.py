# users/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework.permissions import IsAuthenticated

from .models import VendorProfile
from .serializers import (
    CustomerSignupSerializer,
    VendorSignupSerializer,
    UserSerializer,
    LoginSerializer,
    ProfileSerializer,
    PasswordUpdateSerializer,
    AdminVendorSerializer,
    UploadLogoSerializer,
    UploadBannerSerializer,
)
from .permissions import IsAdmin, IsVendor
from .utils import send_verification_email

User = get_user_model()


class CustomerRegisterView(APIView):
    def post(self, request):
        serializer = CustomerSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Customer account created successfully.", "user": UserSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorRegisterView(APIView):
    def post(self, request):
        serializer = VendorSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Vendor account created successfully. Awaiting approval.", "user": UserSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # vendor approval check
            if user.role == User.Roles.VENDOR:
                try:
                    vp = user.vendor_profile
                except VendorProfile.DoesNotExist:
                    return Response({"message": "Vendor profile not found."}, status=status.HTTP_400_BAD_REQUEST)
                if vp.approval_status != "APPROVED":
                    return Response({"message": "Vendor account is pending approval by the Admin."}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response(
                {"message": "Login successful.", "role": user.role, "access": str(refresh.access_token), "refresh": str(refresh)},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]
    def get(self, request):
        return Response({"message": "Welcome to the Vendor Dashboard!"}, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {"username": user.username, "email": user.email, "role": user.role}
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True, context={})
        if serializer.is_valid():
            user = serializer.save()
            if serializer.context.get("verification_needed"):
                try:
                    send_verification_email(user)
                except Exception:
                    return Response({"message": "Profile saved; verification email failed to send."}, status=status.HTTP_200_OK)
                return Response({"message": "Verification email sent.", "verification_sent": True}, status=status.HTTP_200_OK)
            return Response({"message": "Profile updated.", "verification_sent": False}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        serializer = PasswordUpdateSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Admin endpoints
# -------------------------
class AdminVendorListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def get(self, request):
        vendor_profiles = VendorProfile.objects.select_related("user").all()
        data = []
        for vp in vendor_profiles:
            data.append({
                "id": vp.user.id,
                "username": vp.user.username,
                "email": vp.user.email,
                "shop_name": vp.shop_name,
                "shop_slug": vp.shop_slug,
                "approval_status": vp.approval_status,
                "logo": vp.logo.url if vp.logo else None,
                "banner": vp.banner.url if vp.banner else None,
            })
        return Response({"vendors": data}, status=status.HTTP_200_OK)


class AdminApproveVendorView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def post(self, request, id):
        user = get_object_or_404(User, pk=id)
        try:
            vp = user.vendor_profile
        except VendorProfile.DoesNotExist:
            return Response({"detail": "Vendor profile not found."}, status=status.HTTP_404_NOT_FOUND)
        vp.approval_status = "APPROVED"
        vp.save()
        return Response({"message": "Vendor approved."}, status=status.HTTP_200_OK)


# -------------------------
# Vendor uploads
# -------------------------
class VendorUploadLogoView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]
    def post(self, request):
        serializer = UploadLogoSerializer(data=request.data)
        if serializer.is_valid():
            logo = serializer.validated_data["logo"]
            vp = request.user.vendor_profile
            vp.logo = logo
            vp.save()
            return Response({"message": "Logo uploaded.", "logo_url": vp.logo.url}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VendorUploadBannerView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]
    def post(self, request):
        serializer = UploadBannerSerializer(data=request.data)
        if serializer.is_valid():
            banner = serializer.validated_data["banner"]
            vp = request.user.vendor_profile
            vp.banner = banner
            vp.save()
            return Response({"message": "Banner uploaded.", "banner_url": vp.banner.url}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
