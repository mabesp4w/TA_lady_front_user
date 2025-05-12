/** @format */
// src/components/rooms/SearchFilter.tsx
import { Search, Filter } from "lucide-react";

interface RoomType {
  id: string;
  nm_jenis_kamar: string;
}

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  roomTypes: RoomType[];
}

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  roomTypes,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari kamar..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      <div className="relative">
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Semua Jenis Kamar</option>
          {roomTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nm_jenis_kamar}
            </option>
          ))}
        </select>
        <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
