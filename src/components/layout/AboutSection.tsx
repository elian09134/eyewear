"use client";

import { motion } from 'framer-motion';
import { Eye, Shield, Sparkles } from 'lucide-react';

const features = [
    {
        icon: <Eye className="w-8 h-8 text-blue-400" />,
        title: "Crystal Clear Vision",
        description: "Our lenses are crafted with precision technology to ensure absolute clarity and comfort for your eyes."
    },
    {
        icon: <Shield className="w-8 h-8 text-emerald-400" />,
        title: "Durable Protection",
        description: "Scratch-resistant and UV-protective coatings keep your eyes safe and your glasses looking new."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-purple-400" />,
        title: "Premium Design",
        description: "Designed for the modern visionary, combining minimalist aesthetics with maximum durability."
    }
];

export function AboutSection() {
    return (
        <section id="about" className="relative py-24 bg-black overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-display font-bold text-white md:text-5xl">
                            More Than Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Eyewear</span>
                        </h2>
                        <p className="mt-4 text-lg text-white/60">
                            At Lumina, we believe that glasses are an extension of your personality.
                            We blend cutting-edge optical technology with avant-garde design to create
                            eyewear that empowers you to see the world differently.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="mb-4 inline-flex p-3 rounded-xl bg-white/5">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-white/60">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
