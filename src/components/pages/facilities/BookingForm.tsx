/** @format */
// src/components/facilities/BookingForm.tsx
import { useState, useEffect } from "react";
import { Clock, Users } from "lucide-react";
import moment from "moment";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormDateInput from "@/components/form/FormDateInput";
import FormInput from "@/components/form/FormInput";
import showRupiah from "@/services/rupiah";

interface BookingFormProps {
  facilityPrice: number;
  operatingHours: {
    opening: string;
    closing: string;
  };
  onSubmit: (booking: {
    date: string;
    startTime: string;
    endTime: string;
    people: number;
    totalPrice: number;
  }) => void;
  isLoading: boolean;
}

export default function BookingForm({
  facilityPrice,
  operatingHours,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(facilityPrice);
  const [durationHours, setDurationHours] = useState(1);

  const getTimeOptions = () => {
    const startHour = parseInt(operatingHours.opening.split(":")[0]);
    const endHour = parseInt(operatingHours.closing.split(":")[0]);

    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (const minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push({ value: timeString, label: timeString });
      }
    }
    return options;
  };

  // Calculate hours between start and end time
  useEffect(() => {
    if (startTime && endTime) {
      const start = moment(startTime, "HH:mm");
      const end = moment(endTime, "HH:mm");

      if (end.isBefore(start)) {
        end.add(1, "day"); // Handle across midnight
      }

      const duration = moment.duration(end.diff(start));
      const hours = duration.asHours();

      if (hours > 0) {
        setDurationHours(hours);
        setTotalPrice(facilityPrice * hours);
      } else {
        setDurationHours(0);
        setTotalPrice(0);
      }
    }
  }, [startTime, endTime, facilityPrice]);

  const handleSubmit = () => {
    onSubmit({
      date: bookingDate,
      startTime,
      endTime,
      people,
      totalPrice,
    });
  };

  const isSubmitDisabled =
    !bookingDate || !startTime || !endTime || durationHours <= 0 || people < 1;

  return (
    <Card>
      <h2 className="text-lg font-bold mb-4">Pesan Fasilitas</h2>

      <div className="space-y-4">
        <FormDateInput
          label="Tanggal Pemesanan"
          min={moment().format("YYYY-MM-DD")}
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Waktu Mulai
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">Pilih waktu</option>
                {getTimeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Clock
                className="absolute right-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Waktu Selesai
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!startTime}
              >
                <option value="">Pilih waktu</option>
                {getTimeOptions()
                  .filter((option) => {
                    if (!startTime) return true;
                    return option.value > startTime;
                  })
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <Clock
                className="absolute right-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        <FormInput
          label="Jumlah Orang"
          type="number"
          min="1"
          value={people.toString()}
          onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
          icon={<Users size={18} />}
        />

        {totalPrice > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Harga per jam</span>
              <span>{showRupiah(facilityPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Durasi</span>
              <span>{durationHours} jam</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{showRupiah(totalPrice)}</span>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading || isSubmitDisabled}
          onClick={handleSubmit}
        >
          Pesan Sekarang
        </Button>
      </div>
    </Card>
  );
}
