"use client";

import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2880&auto=format&fit=crop"
                    alt="Premium Eyewear"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl space-y-6"
                >
                    <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
                        See the Future <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Clearly.
                        </span>
                    </h1>
                    <p className="max-w-md text-lg text-white/70 md:text-xl">
                        Experience premium eyewear designed for the digital age. Lightweight, durable, and unmistakably stylish.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button size="lg" className="rounded-full bg-white px-8 text-black hover:bg-white/90">
                            Shop Collection
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm">
                            View Lookbook
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
