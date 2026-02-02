"use client";

import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from "framer-motion";

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
        <section id="gallery" className="py-24 bg-black overflow-hidden relative">
            {/* Background Glow Effects */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 mb-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">Lookbook</p>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Diaries</span>
                    </h2>
                </motion.div>
            </div>

            {/* Desktop/Tablet: Interactive 3D Gallery */}
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

            {/* Mobile: Bento Grid Fallback */}
            <div className="md:hidden container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    {galleryItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative aspect-square group cursor-pointer overflow-hidden rounded-2xl"
                        >
                            <Image
                                src={item.image}
                                alt={item.text}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110"
                                sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-bold text-lg">{item.text}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
