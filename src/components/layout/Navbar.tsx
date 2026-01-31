import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm will-change-transform">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold tracking-tight text-white">
                        LUMINA
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#products" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Collections
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        About
                    </Link>
                </nav>
                <Button variant="primary" size="sm" className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Shop Now</span>
                </Button>
            </div>
        </header>
    );
}
