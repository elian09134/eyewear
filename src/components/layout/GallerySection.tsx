"use client";

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with OGL/Canvas
const CircularGallery = dynamic(() => import('@/components/ui/CircularGallery'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-white/20">Loading Gallery...</div>
});

const galleryItems = [
    { image: 'https://images.unsplash.com/photo-1574718048197-25e4e73f9825?w=800', text: 'Street Style' },
    { image: 'https://images.unsplash.com/photo-1514352877526-70e170940428?w=800', text: 'Classic' },
    { image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', text: 'Aviator' },
    { image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', text: 'Vintage' },
    { image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800', text: 'Rounded' },
];

export function GallerySection() {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="container mx-auto px-4 mb-12">
                <h2 className="text-3xl font-display font-bold text-white text-center">
                    Visual <span className="text-white/50">Diaries</span>
                </h2>
            </div>

            {/* Desktop/Tablet: Interactive Gallery */}
            <div className="hidden md:block w-full relative" style={{ height: '600px' }}>
                <CircularGallery
                    items={galleryItems}
                    bend={1}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollSpeed={2}
                    scrollEase={0.05}
                />
            </div>

            {/* Mobile: Static Grid Fallback */}
            <div className="md:hidden grid grid-cols-2 gap-4 px-4">
                {galleryItems.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={item.image}
                            alt={item.text}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-sm font-medium text-white">{item.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
