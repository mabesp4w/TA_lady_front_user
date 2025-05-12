/** @format */
// src/components/rooms/BookingForm.tsx
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import moment from "moment";
import Button from "@/components/ui/Button";

interface BookingFormProps {
  roomPrice: number;
  onSubmit: (dates: {
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  }) => void;
  isLoading: boolean;
}

export default function BookingForm({
  roomPrice,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 0) {
        setNights(daysDiff);
        setTotalPrice(daysDiff * roomPrice);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, roomPrice]);

  const handleSubmit = () => {
    onSubmit({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Pesan Kamar</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Tanggal Check-in</label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              min={moment().format("YYYY-MM-DD")}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
            <Calendar
              className="absolute right-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Tanggal Check-out</label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              min={checkInDate || moment().add(1, "days").format("YYYY-MM-DD")}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
            <Calendar
              className="absolute right-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {totalPrice > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Harga per malam</span>
              <span>Rp{roomPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Jumlah malam</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={
            isLoading || !checkInDate || !checkOutDate || totalPrice <= 0
          }
          onClick={handleSubmit}
        >
          Pesan Sekarang
        </Button>
      </div>
    </div>
  );
}
