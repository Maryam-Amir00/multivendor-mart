export default function Input({ label, type="text", value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      {label && <label className="font-medium">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
