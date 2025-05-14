/** @format */

// src/components/pages/orders/OrderPayment.tsx
import { PesananType } from "@/types";
import Button from "@/components/ui/Button";
import showRupiah from "@/services/rupiah";

interface OrderPaymentProps {
  order: PesananType;
  onPayNow: () => void;
  onCancel: () => void;
}

const OrderPayment = ({ order, onPayNow, onCancel }: OrderPaymentProps) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 sticky top-4">
      <h2 className="font-semibold text-lg mb-4">Ringkasan Pembayaran</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{showRupiah(order.total_jumlah)}</span>
        </div>
        {/* You can add more details here if needed (tax, shipping, etc.) */}
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total:</span>
          <span>{showRupiah(order.total_jumlah)}</span>
        </div>
      </div>

      {order.status_pembayaran === "belum_dibayar" &&
        order.status === "menunggu" && (
          <div className="space-y-2">
            <Button onClick={onPayNow} variant="primary" className="w-full">
              Bayar Sekarang
            </Button>
            <Button onClick={onCancel} variant="outline" className="w-full">
              Batalkan Pesanan
            </Button>
          </div>
        )}

      {order.status_pembayaran === "dibayar" && (
        <div className="bg-green-100 text-green-800 p-3 rounded text-center">
          Pembayaran telah selesai
        </div>
      )}

      {order.status === "dibatalkan" && (
        <div className="bg-red-100 text-red-800 p-3 rounded text-center">
          Pesanan telah dibatalkan
        </div>
      )}

      {order.status_pembayaran === "dikembalikan" && (
        <div className="bg-blue-100 text-blue-800 p-3 rounded text-center">
          Pembayaran telah dikembalikan
        </div>
      )}

      {order.pembayaran && order.pembayaran.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Informasi Pembayaran:</h3>
          {order.pembayaran.map((payment) => (
            <div key={payment.id} className="text-sm mb-2 last:mb-0">
              <p className="flex justify-between">
                <span>Metode:</span>
                <span className="font-medium capitalize">
                  {payment.metode_pembayaran}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Jumlah:</span>
                <span className="font-medium">
                  {showRupiah(payment.jumlah)}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium capitalize">{payment.status}</span>
              </p>
              <p className="flex justify-between">
                <span>Tanggal:</span>
                <span className="font-medium">
                  {new Date(payment.created_at).toLocaleDateString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPayment;
