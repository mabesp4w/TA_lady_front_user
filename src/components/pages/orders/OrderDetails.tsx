/** @format */

// src/components/pages/orders/OrderDetails.tsx
import { PesananType } from "@/types";
import moment from "moment";

interface OrderDetailsProps {
  order: PesananType;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "menunggu":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-yellow-600 bg-yellow-100">
            Menunggu
          </span>
        );
      case "diproses":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-blue-600 bg-blue-100">
            Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-green-600 bg-green-100">
            Selesai
          </span>
        );
      case "dibatalkan":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-100">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-gray-600 bg-gray-100">
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "belum_dibayar":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-100">
            Belum Dibayar
          </span>
        );
      case "dibayar":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-green-600 bg-green-100">
            Sudah Dibayar
          </span>
        );
      case "dikembalikan":
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-blue-600 bg-blue-100">
            Dana Dikembalikan
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded text-xs font-medium text-gray-600 bg-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 mb-6">
      <h2 className="font-semibold text-lg mb-4">Informasi Pesanan</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Kode Pesanan</p>
          <p className="font-medium">{order.kode_pesanan}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tanggal Pesanan</p>
          <p className="font-medium">
            {moment(order.created_at).format("DD-MM-YYYY HH:mm:ss")}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status Pesanan</p>
          <div className="mt-1">{getStatusBadge(order.status)}</div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status Pembayaran</p>
          <div className="mt-1">
            {getPaymentStatusBadge(order.status_pembayaran)}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Jenis Pesanan</p>
          <p className="font-medium capitalize">{order.jenis_pesanan}</p>
        </div>
        {order.catatan && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Catatan</p>
            <p className="font-medium">{order.catatan}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
