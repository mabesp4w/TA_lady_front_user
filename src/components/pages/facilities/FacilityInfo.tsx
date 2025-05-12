/** @format */
// src/components/facilities/FacilityInfo.tsx
import { Clock, Users, Check, AlertCircle } from "lucide-react";
import { FasilitasType } from "@/types";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import showRupiah from "@/services/rupiah";

interface FacilityInfoProps {
  facility: FasilitasType;
}

export default function FacilityInfo({ facility }: FacilityInfoProps) {
  return (
    <Card>
      <h1 className="text-2xl font-bold">{facility.nm_fasilitas}</h1>

      <div className="mt-4 space-y-4">
        <div className="flex items-center">
          <Clock className="text-gray-500 mr-2" size={20} />
          <span>
            Jam Operasional: {facility.jam_buka} - {facility.jam_tutup}
          </span>
        </div>

        {facility.kapasitas && (
          <div className="flex items-center">
            <Users className="text-gray-500 mr-2" size={20} />
            <span>Kapasitas: {facility.kapasitas} Orang</span>
          </div>
        )}

        <div className="py-3 border-t border-b border-gray-100">
          <p className="text-gray-700">
            {facility.deskripsi ||
              "Tidak ada deskripsi fasilitas yang tersedia."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-primary font-bold text-2xl">
            {showRupiah(facility.harga)}
          </div>

          <div>
            {facility.tersedia ? (
              <Badge variant="green">
                <Check size={16} className="mr-1" />
                Tersedia
              </Badge>
            ) : (
              <Badge variant="red">
                <AlertCircle size={16} className="mr-1" />
                Tidak Tersedia
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
