/** @format */
// src/components/shop/ProductCard.tsx
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import QuantitySelector from "./QuantitySelector";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

interface Product {
  id: string;
  nm_produk: string;
  harga: number;
  tersedia: boolean;
  jalur_gambar?: string;
}

interface ProductCardProps {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  quantity,
  onIncrement,
  onDecrement,
}: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();

  // Fungsi untuk menangani penambahan ke keranjang dengan verifikasi login
  const handleAddToCart = async () => {
    // Cek apakah user sudah login
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    // Jika sudah login, tambahkan ke keranjang
    const success = await addToCart(product.id, quantity);
    if (success) {
      toast.success(`${product.nm_produk} ditambahkan ke keranjang`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {product.jalur_gambar ? (
        <div className="relative h-48 w-full">
          <Image
            src={product.jalur_gambar}
            alt={product.nm_produk}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {!product.tersedia && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Habis</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.nm_produk}</h3>
        <p className="text-lg font-bold text-primary mb-4">
          Rp{product.harga.toLocaleString("id-ID")}
        </p>

        {product.tersedia ? (
          <>
            <div className="mb-4">
              <QuantitySelector
                quantity={quantity}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
              />
            </div>
            <Button
              icon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              className="w-full"
            >
              Tambah
            </Button>
          </>
        ) : (
          <Button disabled className="w-full">
            Habis
          </Button>
        )}
      </div>
    </div>
  );
}
