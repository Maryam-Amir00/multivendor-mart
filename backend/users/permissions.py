# users/permissions.py
from rest_framework.permissions import BasePermission
from .models import VendorProfile

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == user.Roles.ADMIN)

class IsVendor(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated or user.role != user.Roles.VENDOR:
            return False
        try:
            vp = user.vendor_profile
        except VendorProfile.DoesNotExist:
            return False
        return vp.approval_status == "APPROVED"
