"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
}

export default function CircularGallery({
  items = [],
  textColor = "#ffffff",
  borderRadius = 0.05,
}: CircularGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect (optional, keeps it alive)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollAmount = 0;
    const speed = 0.5; // slow auto-scroll

    const animate = () => {
      scrollAmount += speed;
      if (el) {
        // Reset if we hit the end (infinite loop illusion by duplicating items ideally, 
        // but for now simple scroll is safer)
        if (scrollAmount >= el.scrollWidth - el.clientWidth) {
             scrollAmount = 0; // simplistic loop
        }
        el.scrollLeft = scrollAmount;
      }
      animationId = requestAnimationFrame(animate);
    };

    // Only auto-scroll if user isn't hovering? 
    // Actually, let's stick to a clean manual horizontal scroll with snap for stability
    // Removing auto-scroll to avoid complexity/bugs.
    // animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div 
      ref={scrollRef}
      className="flex w-full overflow-x-auto gap-8 px-8 py-12 snap-x snap-mandatory scrollbar-hide items-center h-full"
      style={{ scrollBehavior: 'smooth' }}
    >
      {items.map((item, i) => (
        <div 
          key={i} 
          className="relative flex-none w-[300px] md:w-[400px] aspect-[4/5] snap-center group transition-transform hover:scale-105 duration-500"
          style={{ borderRadius: `${borderRadius * 100}rem` }} // converting float to approx rem/px radius
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
            <Image
              src={item.image}
              alt={item.text}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-6 left-6">
               <h3 className="text-2xl font-bold" style={{ color: textColor }}>{item.text}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
