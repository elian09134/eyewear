"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { TrendingUp, MousePointerClick, Package, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
    totalClicks: number;
    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    topProducts: { product: Product; clicks: number }[];
    recentClicks: { product_name: string; created_at: string }[];
}

interface StockData {
    inStock: number;
    outOfStock: number;
    lowStockProducts: Product[];
}

export function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'clicks' | 'stock'>('overview');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        try {
            // Fetch all analytics
            const { data: allClicks } = await supabase
                .from('analytics')
                .select('*, products(name)')
                .order('created_at', { ascending: false });

            // Fetch products
            const { data: products } = await supabase
                .from('products')
                .select('*');

            if (allClicks && products) {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

                // Calculate click stats
                const clicksToday = allClicks.filter(c => new Date(c.created_at) >= today).length;
                const clicksThisWeek = allClicks.filter(c => new Date(c.created_at) >= weekAgo).length;
                const clicksThisMonth = allClicks.filter(c => new Date(c.created_at) >= monthAgo).length;

                // Top products by clicks
                const productClickCounts: { [key: string]: number } = {};
                allClicks.forEach(click => {
                    if (click.product_id) {
                        productClickCounts[click.product_id] = (productClickCounts[click.product_id] || 0) + 1;
                    }
                });

                const topProducts = Object.entries(productClickCounts)
                    .map(([productId, clicks]) => ({
                        product: products.find(p => p.id === productId) as Product,
                        clicks
                    }))
                    .filter(item => item.product)
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5);

                // Recent clicks
                const recentClicks = allClicks.slice(0, 10).map(click => ({
                    product_name: (click.products as any)?.name || 'Unknown',
                    created_at: click.created_at
                }));

                setAnalytics({
                    totalClicks: allClicks.length,
                    clicksToday,
                    clicksThisWeek,
                    clicksThisMonth,
                    topProducts,
                    recentClicks
                });

                // Stock data
                const inStock = products.filter(p => p.in_stock !== false).length;
                const outOfStock = products.filter(p => p.in_stock === false).length;

                setStockData({
                    inStock,
                    outOfStock,
                    lowStockProducts: products.filter(p => p.in_stock === false)
                });
            }
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white/50">Loading analytics...</div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4">
                {(['overview', 'clicks', 'stock'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <MousePointerClick className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="text-white/50 text-sm">Today</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics?.clicksToday || 0}</p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-white/50 text-sm">This Week</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics?.clicksThisWeek || 0}</p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-400" />
                                </div>
                                <span className="text-white/50 text-sm">This Month</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{analytics?.clicksThisMonth || 0}</p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Package className="w-5 h-5 text-orange-400" />
                                </div>
                                <span className="text-white/50 text-sm">Stock</span>
                            </div>
                            <p className="text-3xl font-bold text-white">
                                <span className="text-green-400">{stockData?.inStock || 0}</span>
                                <span className="text-white/30 mx-1">/</span>
                                <span className="text-red-400">{stockData?.outOfStock || 0}</span>
                            </p>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Products */}
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
                            {analytics?.topProducts.length ? (
                                <div className="space-y-3">
                                    {analytics.topProducts.map((item, i) => (
                                        <div key={item.product.id} className="flex items-center gap-3">
                                            <span className="text-white/30 w-6">{i + 1}.</span>
                                            <div className="flex-1 truncate text-white">{item.product.name}</div>
                                            <span className="text-blue-400 font-medium">{item.clicks} clicks</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/50 text-sm">No data yet</p>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Clicks</h3>
                            {analytics?.recentClicks.length ? (
                                <div className="space-y-3">
                                    {analytics.recentClicks.map((click, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-white truncate flex-1">{click.product_name}</span>
                                            <span className="text-white/50 text-sm">{formatDate(click.created_at)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/50 text-sm">No clicks yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Clicks Tab */}
            {activeTab === 'clicks' && (
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">All Order Clicks</h3>
                        <p className="text-white/50 mb-4">Total: {analytics?.totalClicks || 0} clicks</p>
                        
                        {analytics?.recentClicks.length ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {analytics.recentClicks.map((click, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                        <span className="text-white">{click.product_name}</span>
                                        <span className="text-white/50 text-sm">{formatDate(click.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-white/50">No clicks recorded yet</p>
                        )}
                    </div>
                </div>
            )}

            {/* Stock Tab */}
            {activeTab === 'stock' && (
                <div className="space-y-6">
                    {/* Stock Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Package className="w-5 h-5 text-green-400" />
                                </div>
                                <span className="text-white/50">In Stock</span>
                            </div>
                            <p className="text-4xl font-bold text-green-400">{stockData?.inStock || 0}</p>
                        </div>

                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-500/20 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <span className="text-white/50">Out of Stock</span>
                            </div>
                            <p className="text-4xl font-bold text-red-400">{stockData?.outOfStock || 0}</p>
                        </div>
                    </div>

                    {/* Out of Stock Products */}
                    {stockData?.lowStockProducts.length ? (
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                Out of Stock Products
                            </h3>
                            <div className="space-y-3">
                                {stockData.lowStockProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <div>
                                            <p className="text-white font-medium">{product.name}</p>
                                            <p className="text-white/50 text-sm">{product.category}</p>
                                        </div>
                                        <span className="text-red-400 text-sm font-medium">Sold Out</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 text-center">
                            <Package className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p className="text-white font-medium">All products are in stock!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
