/** @format */
// src/components/shop/ProductFilter.tsx
import { Search, Filter } from "lucide-react";

interface Category {
  id: string;
  nm_kategori_produk: string;
}

interface ProductFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: Category[];
}

export default function ProductFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      <div className="relative">
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 appearance-none pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nm_kategori_produk}
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
