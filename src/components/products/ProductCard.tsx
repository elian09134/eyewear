"use client";

import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const handleBuy = () => {
        // Basic WhatsApp link generator
        const phoneNumber = '6285175090448'; // Replace with actual number
        const message = `Halo, saya tertarik dengan kacamata ${product.name} seharga Rp ${product.price.toLocaleString('id-ID')}. Apakah stok masih ada?`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all hover:border-white/20 hover:bg-white/10">
            <div className="relative aspect-square w-full overflow-hidden bg-black/50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <p className="text-xs font-medium text-blue-400 mb-1">{product.category}</p>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-semibold text-white">
                        Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    <Button onClick={handleBuy} size="sm" className="gap-2 bg-green-600 hover:bg-green-500 border-none text-white">
                        <MessageCircle className="w-4 h-4" />
                        Buy via WA
                    </Button>
                </div>
            </div>
        </div>
    );
}
