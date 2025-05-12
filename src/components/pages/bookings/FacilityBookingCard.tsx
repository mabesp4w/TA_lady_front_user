/** @format */
// src/components/bookings/FacilityBookingCard.tsx
import { Calendar, Clock, ChevronRight } from "lucide-react";
import moment from "moment";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface FacilityBooking {
  id: string;
  facility?: {
    nm_fasilitas: string;
  };
  tanggal_pemesanan: string;
  waktu_mulai: string;
  waktu_selesai: string;
  jumlah_orang: number;
  total_harga: number;
  status?: string;
  status_pembayaran?: string;
}

interface FacilityBookingCardProps {
  booking: FacilityBooking;
  onViewDetail: (id: string) => void;
}

export default function FacilityBookingCard({
  booking,
  onViewDetail,
}: FacilityBookingCardProps) {
  const getStatusBadge = (status: string = "menunggu") => {
    switch (status) {
      case "menunggu":
        return <Badge variant="yellow">Menunggu Konfirmasi</Badge>;
      case "dikonfirmasi":
        return <Badge variant="blue">Dikonfirmasi</Badge>;
      case "digunakan":
        return <Badge variant="green">Digunakan</Badge>;
      case "selesai":
        return <Badge variant="gray">Selesai</Badge>;
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

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{booking.facility?.nm_fasilitas}</h3>
          <p className="text-sm text-gray-600">{booking.jumlah_orang} Orang</p>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">
            Tanggal: {moment(booking.tanggal_pemesanan).format("DD MMM YYYY")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">
            Waktu: {booking.waktu_mulai} - {booking.waktu_selesai}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm">Total:</span>
          <span className="font-bold text-primary ml-2">
            Rp{booking.total_harga.toLocaleString("id-ID")}
          </span>
        </div>
        {getPaymentStatusBadge(booking.status_pembayaran)}
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          icon={<ChevronRight size={16} />}
          onClick={() => onViewDetail(booking.id)}
        >
          Lihat Detail
        </Button>
      </div>
    </Card>
  );
}
