/** @format */
// src/components/bookings/RoomBookingCard.tsx
import { Calendar, ChevronRight } from "lucide-react";
import moment from "moment";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import showRupiah from "@/services/rupiah";

interface RoomBooking {
  id: string;
  room?: {
    no_kamar: string;
    roomType?: {
      nm_jenis_kamar: string;
    };
  };
  tanggal_check_in: string;
  tanggal_check_out: string;
  total_harga: number;
  status?: string;
  status_pembayaran?: string;
}

interface RoomBookingCardProps {
  booking: RoomBooking;
  onViewDetail: (id: string) => void;
}

export default function RoomBookingCard({
  booking,
  onViewDetail,
}: RoomBookingCardProps) {
  const getStatusBadge = (status: string = "menunggu") => {
    switch (status) {
      case "menunggu":
        return <Badge variant="yellow">Menunggu Konfirmasi</Badge>;
      case "dikonfirmasi":
        return <Badge variant="blue">Dikonfirmasi</Badge>;
      case "check_in":
        return <Badge variant="green">Check In</Badge>;
      case "check_out":
        return <Badge variant="gray">Check Out</Badge>;
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
          <h3 className="font-semibold">
            {booking.room?.roomType?.nm_jenis_kamar}
          </h3>
          <p className="text-sm text-gray-600">
            Kamar {booking.room?.no_kamar}
          </p>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">
            Check-in: {moment(booking.tanggal_check_in).format("DD MMM YYYY")}
          </span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="text-sm">
            Check-out: {moment(booking.tanggal_check_out).format("DD MMM YYYY")}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm">Total:</span>
          <span className="font-bold text-primary ml-2">
            {showRupiah(booking.total_harga)}
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
