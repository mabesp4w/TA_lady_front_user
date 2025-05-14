/** @format */
// src/components/pages/bookings/OrderCard.tsx
import { Package, ChevronRight } from "lucide-react";
import moment from "moment";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PesananType } from "@/types";
import showRupiah from "@/services/rupiah";

interface OrderCardProps {
  order: PesananType;
  onViewDetail: (id: string) => void;
  onCancel: () => void;
}

export default function OrderCard({
  order,
  onViewDetail,
  onCancel,
}: OrderCardProps) {
  const getStatusBadge = (status: string = "menunggu") => {
    switch (status) {
      case "menunggu":
        return <Badge variant="yellow">Menunggu</Badge>;
      case "diproses":
        return <Badge variant="blue">Diproses</Badge>;
      case "selesai":
        return <Badge variant="green">Selesai</Badge>;
      case "dibatalkan":
        return <Badge variant="red">Dibatalkan</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string = "belum_dibayar") => {
    switch (status) {
      case "belum_dibayar":
        return <Badge variant="red">Belum Dibayar</Badge>;
      case "dibayar":
        return <Badge variant="green">Sudah Dibayar</Badge>;
      case "dikembalikan":
        return <Badge variant="gray">Dikembalikan</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  const totalItems = order.item_pesanan?.length || 0;

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Pesanan #{order.kode_pesanan}</h3>
          <p className="text-sm text-gray-600">
            {moment(order.created_at).format("DD MMM YYYY, HH:mm")}
          </p>
        </div>
        {getStatusBadge(order.status)}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <Package size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">
            {totalItems} produk{" "}
            {order.jenis_pesanan === "online" ? "(Online)" : "(Offline)"}
          </span>
        </div>
        {order.item_pesanan && order.item_pesanan.length > 0 && (
          <div className="text-sm text-gray-600 pl-6">
            {order.item_pesanan.slice(0, 2).map((item) => (
              <div key={item.id} className="truncate">
                {item.produk?.nm_produk} x{item.jumlah}
              </div>
            ))}
            {order.item_pesanan.length > 2 && (
              <div className="text-xs text-gray-500">
                +{order.item_pesanan.length - 2} produk lainnya
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm">Total:</span>
          <span className="font-bold text-primary ml-2">
            {showRupiah(order.total_jumlah)}
          </span>
        </div>
        {getPaymentStatusBadge(order.status_pembayaran)}
      </div>

      <div className="mt-4 flex space-x-2">
        {order.status === "menunggu" &&
          order.status_pembayaran === "belum_dibayar" && (
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Batalkan
            </Button>
          )}
        <Button
          variant="outline"
          className={order.status === "menunggu" ? "flex-1" : "w-full"}
          icon={<ChevronRight size={16} />}
          onClick={() => onViewDetail(order.id)}
        >
          Lihat Detail
        </Button>
      </div>
    </Card>
  );
}
