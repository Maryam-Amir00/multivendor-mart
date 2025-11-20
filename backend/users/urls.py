# users/urls.py
from django.urls import path
from .views import (
    CustomerRegisterView,
    VendorRegisterView,
    LoginView,
    VendorDashboardView,
    UserProfileView,
    PasswordUpdateView,
    LogoutView,
    AdminVendorListView,
    AdminApproveVendorView,
    VendorUploadLogoView,
    VendorUploadBannerView,
)

urlpatterns = [
    path("register-customer/", CustomerRegisterView.as_view(), name="register-customer"),
    path("register-vendor/", VendorRegisterView.as_view(), name="register-vendor"),
    path("login/", LoginView.as_view(), name="login"),
    path("vendor/dashboard/", VendorDashboardView.as_view(), name="vendor-dashboard"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("password-update/", PasswordUpdateView.as_view(), name="password-update"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # admin
    path("admin/vendors/", AdminVendorListView.as_view(), name="admin-vendors-list"),
    path("admin/vendors/<int:id>/approve/", AdminApproveVendorView.as_view(), name="admin-vendor-approve"),

    # vendor uploads
    path("vendor/upload-logo/", VendorUploadLogoView.as_view(), name="vendor-upload-logo"),
    path("vendor/upload-banner/", VendorUploadBannerView.as_view(), name="vendor-upload-banner"),
]
