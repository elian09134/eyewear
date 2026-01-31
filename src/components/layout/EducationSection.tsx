"use client";

import { motion } from 'framer-motion';
import { Sun, Monitor, Ruler, SprayCan } from 'lucide-react';

const tips = [
    {
        icon: <Monitor className="w-6 h-6 text-blue-400" />,
        title: "Blue Light Protection",
        description: "Essential for digital natives. Filters out harmful blue light from screens to reduce eye strain and improve sleep quality."
    },
    {
        icon: <Sun className="w-6 h-6 text-amber-400" />,
        title: "UV400 Protection",
        description: "Blocks 99-100% of UV rays. Crucial for long-term eye health, preventing cataracts and macular degeneration."
    },
    {
        icon: <Ruler className="w-6 h-6 text-rose-400" />,
        title: "Fit & Comfort",
        description: "Your eyes should be centered in the lens. The frame width should match your face width, and temples should sit comfortably."
    },
    {
        icon: <SprayCan className="w-6 h-6 text-cyan-400" />,
        title: "Lens Care",
        description: "Always use a microfiber cloth. Avoid paper towels which can scratch lenses. Wash with mild soap and water occasionally."
    }
];

export function EducationSection() {
    return (
        <section className="py-24 bg-zinc-950 border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Left Column: Title & Intro */}
                    <div className="md:w-1/3 md:sticky md:top-24 h-fit relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl font-display font-bold text-white mb-6">
                                Know Your <br />
                                <span className="text-white/50">Eyewear.</span>
                            </h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Choosing the right eyewear goes beyond style. Understanding lens technology and proper care ensures your vision remains sharp and your glasses last longer.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Grid of Tips */}
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-900 transition-colors"
                            >
                                <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                    {tip.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    {tip.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
