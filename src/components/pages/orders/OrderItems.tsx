/** @format */

// src/components/pages/orders/OrderItems.tsx
import showRupiah from "@/services/rupiah";
import { ItemPesananType } from "@/types";
import Image from "next/image";

interface OrderItemsProps {
  items: ItemPesananType[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 mb-6">
      <h2 className="font-semibold text-lg mb-4">Item Pesanan</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Tidak ada item dalam pesanan ini.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="relative w-16 h-16 mr-4">
                {item.produk?.jalur_gambar ? (
                  <Image
                    src={item.produk.jalur_gambar}
                    alt={item.produk.nm_produk}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {item.produk?.nm_produk || "Produk tidak tersedia"}
                </h3>
                <p className="text-sm text-gray-500">
                  {showRupiah(item.harga_satuan)} x {item.jumlah}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">{showRupiah(item.subtotal)}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold">
                {showRupiah(
                  items.reduce((sum, item) => sum + item.subtotal, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItems;
