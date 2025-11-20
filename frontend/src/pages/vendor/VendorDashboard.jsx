// src/pages/vendor/VendorDashboard.jsx
import ShopLogoUploader from "../../components/vendor/ShopLogoUploader";
import ShopBannerUploader from "../../components/vendor/ShopBannerUploader";

export default function VendorDashboard() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-slate-800">
        Shop Settings
      </h2>

      <p className="text-slate-600">
        Upload your shop logo and banner to customize your storefront.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <ShopLogoUploader />
        <ShopBannerUploader />
      </div>
    </div>
  );
}
