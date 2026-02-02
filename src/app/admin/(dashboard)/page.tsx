"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Sale } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { SalesForm } from '@/components/admin/SalesForm';
import { Plus, Pencil, Trash2, Package, AlertCircle, TrendingUp, Sparkles, Eye, ShoppingBag, DollarSign, Users } from 'lucide-react';

interface AnalyticsData {
    totalClicks: number;
    clicksToday: number;
    clicksThisWeek: number;
    topProducts: { product: Product; clicks: number }[];
}

interface SalesData {
    totalRevenue: number;
    revenueToday: number;
    revenueThisWeek: number;
    totalSales: number;
    salesToday: number;
    recentSales: Sale[];
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [showSalesForm, setShowSalesForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchData = async () => {
        if (!supabase) {
            setError('Supabase not configured');
            setLoading(false);
            return;
        }

        try {
            // Fetch products
            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            setProducts(productsData || []);

            // Fetch analytics
            const { data: allClicks } = await supabase
                .from('analytics')
                .select('*, products(name)')
                .order('created_at', { ascending: false });

            if (allClicks && productsData) {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

                const clicksToday = allClicks.filter(c => new Date(c.created_at) >= today).length;
                const clicksThisWeek = allClicks.filter(c => new Date(c.created_at) >= weekAgo).length;

                const productClickCounts: { [key: string]: number } = {};
                allClicks.forEach(click => {
                    if (click.product_id) {
                        productClickCounts[click.product_id] = (productClickCounts[click.product_id] || 0) + 1;
                    }
                });

                const topProducts = Object.entries(productClickCounts)
                    .map(([productId, clicks]) => ({
                        product: productsData.find(p => p.id === productId) as Product,
                        clicks
                    }))
                    .filter(item => item.product)
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 3);

                setAnalytics({ totalClicks: allClicks.length, clicksToday, clicksThisWeek, topProducts });
            }

            // Fetch sales
            const { data: salesRecords } = await supabase
                .from('sales')
                .select('*, products(name, image)')
                .order('created_at', { ascending: false });

            if (salesRecords) {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

                const salesToday = salesRecords.filter(s => new Date(s.created_at) >= today);
                const salesThisWeek = salesRecords.filter(s => new Date(s.created_at) >= weekAgo);

                setSalesData({
                    totalRevenue: salesRecords.reduce((sum, s) => sum + (s.total_price || 0), 0),
                    revenueToday: salesToday.reduce((sum, s) => sum + (s.total_price || 0), 0),
                    revenueThisWeek: salesThisWeek.reduce((sum, s) => sum + (s.total_price || 0), 0),
                    totalSales: salesRecords.length,
                    salesToday: salesToday.length,
                    recentSales: salesRecords.slice(0, 5)
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        setDeletingId(id);
        try {
            await supabase.from('products').delete().eq('id', id);
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/40 text-sm">Loading your dashboard...</span>
                </div>
            </div>
        );
    }

    const totalStock = products.reduce((sum, p) => sum + (p.stock_count || 0), 0);
    const lowStock = products.filter(p => (p.stock_count || 0) > 0 && (p.stock_count || 0) <= 3).length;
    const outOfStock = products.filter(p => (p.stock_count || 0) === 0).length;
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const formatCurrency = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-white/40 text-sm mb-1">{greeting} ✨</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSalesForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Record Sale
                    </button>
                    <button
                        onClick={() => setShowProductForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-colors border border-white/10"
                    >
                        <Plus className="w-4 h-4" />
                        New Product
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Sales Stats - Main Focus */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-2 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span className="text-white/60 text-sm font-medium">Revenue This Week</span>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{formatCurrency(salesData?.revenueThisWeek || 0)}</p>
                        <p className="text-white/40 text-sm">{formatCurrency(salesData?.revenueToday || 0)} today</p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{salesData?.salesToday || 0}</p>
                    <p className="text-white/40 text-xs">Sales Today</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Eye className="w-4 h-4 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{analytics?.clicksThisWeek || 0}</p>
                    <p className="text-white/40 text-xs">Order Clicks</p>
                </div>
            </div>

            {/* Stock & Recent Sales Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Stock Overview */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 text-white/50" />
                        Stock Overview
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-black/30 rounded-xl">
                            <p className="text-2xl font-bold text-white">{totalStock}</p>
                            <p className="text-white/40 text-xs">Total Units</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                            <p className="text-2xl font-bold text-yellow-400">{lowStock}</p>
                            <p className="text-white/40 text-xs">Low Stock</p>
                        </div>
                        <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-2xl font-bold text-red-400">{outOfStock}</p>
                            <p className="text-white/40 text-xs">Out of Stock</p>
                        </div>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white/50" />
                        Recent Sales
                    </h3>
                    {salesData?.recentSales && salesData.recentSales.length > 0 ? (
                        <div className="space-y-2">
                            {salesData.recentSales.map(sale => (
                                <div key={sale.id} className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{sale.customer_name}</p>
                                        <p className="text-white/40 text-xs truncate">{(sale.products as any)?.name} × {sale.quantity}</p>
                                    </div>
                                    <div className="text-right ml-3">
                                        <p className="text-green-400 text-sm font-medium">{formatCurrency(sale.total_price)}</p>
                                        <p className="text-white/30 text-xs">{formatDate(sale.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/30 text-sm text-center py-4">No sales recorded yet</p>
                    )}
                </div>
            </div>

            {/* Top Products */}
            {analytics?.topProducts && analytics.topProducts.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <h2 className="text-white/60 text-sm font-medium">Top Performers</h2>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {analytics.topProducts.map((item, i) => (
                            <div key={item.product.id} className="flex-none flex items-center gap-3 bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-3">
                                <span className="text-2xl font-bold text-white/20">#{i + 1}</span>
                                <div>
                                    <p className="text-white font-medium text-sm truncate max-w-[150px]">{item.product.name}</p>
                                    <p className="text-blue-400 text-xs">{item.clicks} clicks</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Products</h2>
                    <span className="text-white/30 text-sm">{products.length} items</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl">
                        <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
                        <p className="text-white/40 text-sm mb-6">Add your first product to get started</p>
                        <button
                            onClick={() => setShowProductForm(true)}
                            className="px-5 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
                        >
                            Add Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="group bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                                <div className="relative aspect-[4/3] bg-black/50">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-10 h-10 text-white/10" />
                                        </div>
                                    )}

                                    {/* Stock Badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                                        (product.stock_count || 0) === 0
                                            ? 'bg-red-500/20 text-red-300 border border-red-500/20'
                                            : (product.stock_count || 0) <= 3
                                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'
                                            : 'bg-green-500/20 text-green-300 border border-green-500/20'
                                    }`}>
                                        {product.stock_count || 0} in stock
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-colors"
                                        >
                                            <Pencil className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-blue-400/80 mb-1">{product.category}</p>
                                    <h3 className="text-white font-medium truncate">{product.name}</h3>
                                    <p className="text-white/80 font-semibold text-sm mt-2">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showProductForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                    onSave={() => { setShowProductForm(false); setEditingProduct(null); fetchData(); }}
                />
            )}

            {showSalesForm && (
                <SalesForm
                    products={products}
                    onClose={() => setShowSalesForm(false)}
                    onSave={() => { setShowSalesForm(false); fetchData(); }}
                />
            )}
        </div>
    );
}
