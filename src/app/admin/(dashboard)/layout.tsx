"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/admin/AuthProvider';
import { BarChart3, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/50">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen bg-black">
            {/* Admin Header */}
            <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-bold text-white">Lumina Admin</h1>
                        
                        {/* Navigation */}
                        <nav className="flex items-center gap-2">
                            <Link
                                href="/admin"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/admin')
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Products
                            </Link>
                            <Link
                                href="/admin/analytics"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive('/admin/analytics')
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white/50 text-sm hidden md:block">{user.email}</span>
                        <a
                            href="/"
                            target="_blank"
                            className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                            View Site →
                        </a>
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    );
}
