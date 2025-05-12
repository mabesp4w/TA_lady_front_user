/** @format */
// src/components/facilities/SearchFilter.tsx
import { Search } from "lucide-react";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (value: string) => void;
  categories?: { id: string; name: string }[];
  showFilter?: boolean;
}

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  showFilter = true,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col space-y-4">
      <FormInput
        placeholder="Cari fasilitas..."
        value={searchTerm}
        onChange={(e: any) => setSearchTerm(e.target.value)}
        icon={<Search size={18} />}
      />

      {showFilter && setSelectedCategory && (
        <FormSelect
          value={selectedCategory || ""}
          onChange={(e: any) => setSelectedCategory(e.target.value)}
          options={[
            { value: "", label: "Semua Fasilitas" },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
          icon={<Search size={18} />}
        />
      )}
    </div>
  );
}
