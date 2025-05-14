/** @format */
// src/components/pages/bookings/BookingTabs.tsx

interface BookingTabsProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export default function BookingTabs({
  activeTab,
  onChangeTab,
}: BookingTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "rooms"
            ? "text-primary border-b-2 border-primary"
            : "text-gray-500 hover:text-gray-800"
        }`}
        onClick={() => onChangeTab("rooms")}
      >
        Kamar
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "facilities"
            ? "text-primary border-b-2 border-primary"
            : "text-gray-500 hover:text-gray-800"
        }`}
        onClick={() => onChangeTab("facilities")}
      >
        Fasilitas
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          activeTab === "orders"
            ? "text-primary border-b-2 border-primary"
            : "text-gray-500 hover:text-gray-800"
        }`}
        onClick={() => onChangeTab("orders")}
      >
        Produk
      </button>
    </div>
  );
}
