# users/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.dispatch import receiver


# --------------------------------------------------------------------
# 1. BASE USER MODEL (IDENTITY)
# --------------------------------------------------------------------
class User(AbstractUser):
    """
    Custom User model:
    - Keeps username
    - Email required + unique
    - Role-based system
    - Admin role auto-sets is_staff=True (but NOT superuser)
    """

    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        VENDOR = "VENDOR", "Vendor"
        CUSTOMER = "CUSTOMER", "Customer"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.CUSTOMER)

    pending_email = models.EmailField(null=True, blank=True)
    email_verified = models.BooleanField(default=True)

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ["email"]  # username is still the primary required field

    def save(self, *args, **kwargs):

        # Auto-assign admin panel staff permission
        if self.role == self.Roles.ADMIN:
            self.is_staff = True
        else:
            self.is_staff = False  # Vendors/Customers should NOT access admin panel

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"


# --------------------------------------------------------------------
# 2. PROFILE MODELS (ONE-TO-ONE)
# --------------------------------------------------------------------

# ----------------------------- Vendor Profile -----------------------------
class VendorProfile(models.Model):

    APPROVAL_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="vendor_profile")

    shop_name = models.CharField(max_length=255, blank=True)
    shop_slug = models.SlugField(unique=True, blank=True)
    tax_identity = models.CharField(max_length=255, blank=True)

    # NEW: logo & banner (optional)
    logo = models.ImageField(upload_to="vendor_logos/", blank=True, null=True)
    banner = models.ImageField(upload_to="vendor_banners/", blank=True, null=True)

    approval_status = models.CharField(
        max_length=20, choices=APPROVAL_CHOICES, default="PENDING"
    )

    def save(self, *args, **kwargs):
        # Automatically generate shop_slug if shop_name exists
        if not self.shop_slug and self.shop_name:
            base_slug = slugify(self.shop_name)
            slug = base_slug
            # ensure uniqueness
            counter = 1
            while VendorProfile.objects.filter(shop_slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.shop_slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"VendorProfile: {self.user.username}"


# ----------------------------- Customer Profile -----------------------------
class CustomerProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")

    phone_number = models.CharField(max_length=20, blank=True)
    loyalty_points = models.IntegerField(default=0)
    address = models.TextField(blank=True)

    def __str__(self):
        return f"CustomerProfile: {self.user.username}"


# --------------------------------------------------------------------
# 3. AUTOMATIC PROFILE CREATION (SIGNALS)
# --------------------------------------------------------------------
@receiver(post_save, sender=User)
def create_user_profiles(sender, instance, created, **kwargs):
    """
    Create the correct profile when a User is created.
    Admins do NOT get profiles.
    """
    if created:
        if instance.role == User.Roles.VENDOR:
            VendorProfile.objects.create(user=instance)

        elif instance.role == User.Roles.CUSTOMER:
            CustomerProfile.objects.create(user=instance)

        # Admins get no extra profile
