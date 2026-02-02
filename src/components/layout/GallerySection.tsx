"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const galleryItems = [
    { image: 'https://images.unsplash.com/photo-1574718048197-25e4e73f9825?w=800', text: 'Street Style', size: 'large' },
    { image: 'https://images.unsplash.com/photo-1514352877526-70e170940428?w=800', text: 'Classic', size: 'small' },
    { image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', text: 'Aviator', size: 'small' },
    { image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', text: 'Vintage', size: 'medium' },
    { image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800', text: 'Rounded', size: 'medium' },
];

export function GallerySection() {
    return (
        <section id="gallery" className="py-24 bg-black overflow-hidden relative">
            {/* Background Glow Effects */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 mb-16 relative z-10">
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

            {/* Bento Grid Gallery */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
                    {galleryItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`
                                relative group cursor-pointer overflow-hidden rounded-2xl
                                ${item.size === 'large' ? 'col-span-2 row-span-2' : ''}
                                ${item.size === 'medium' ? 'col-span-2 md:col-span-1 row-span-1 md:row-span-2' : ''}
                                ${item.size === 'small' ? 'col-span-1 row-span-1' : ''}
                            `}
                        >
                            {/* Image */}
                            <Image
                                src={item.image}
                                alt={item.text}
                                fill
                                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Glow Border on Hover */}
                            <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/30 transition-all duration-500 group-hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]" />

                            {/* Text */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <motion.h3 
                                    className="text-white font-bold text-xl md:text-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500"
                                >
                                    {item.text}
                                </motion.h3>
                                <div className="h-0.5 w-0 group-hover:w-12 bg-gradient-to-r from-blue-400 to-purple-500 mt-2 transition-all duration-500" />
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/50 transition-all duration-500 rounded-tr-lg" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
