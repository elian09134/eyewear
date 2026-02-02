"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { Plus, Pencil, Trash2, Package, AlertCircle, TrendingUp, MousePointerClick, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
    totalClicks: number;
    clicksToday: number;
    clicksThisWeek: number;
    clicksThisMonth: number;
    topProducts: { product: Product; clicks: number }[];
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchData = async () => {
        if (!supabase) {
            setError('Supabase not configured. Please add your Supabase credentials to .env.local');
            setLoading(false);
            return;
        }

        try {
            // Fetch products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
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
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

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
                        product: productsData.find(p => p.id === productId) as Product,
                        clicks
                    }))
                    .filter(item => item.product)
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5);

                setAnalytics({
                    totalClicks: allClicks.length,
                    clicksToday,
                    clicksThisWeek,
                    clicksThisMonth,
                    topProducts
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!supabase) return;

        setDeletingId(id);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleStock = async (product: Product) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('products')
                .update({ in_stock: !product.in_stock })
                .eq('id', product.id);

            if (error) throw error;
            fetchData();
        } catch (err: any) {
            setError(err.message || 'Failed to update stock');
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleFormSave = () => {
        handleFormClose();
        fetchData();
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-white/50">Loading...</div>
            </div>
        );
    }

    const inStock = products.filter(p => p.in_stock !== false).length;
    const outOfStock = products.filter(p => p.in_stock === false).length;

    return (
        <div className="space-y-8">
            {/* Error */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Analytics Section */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointerClick className="w-4 h-4 text-blue-400" />
                            <span className="text-white/50 text-xs">Today</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{analytics?.clicksToday || 0}</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-white/50 text-xs">This Week</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{analytics?.clicksThisWeek || 0}</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            <span className="text-white/50 text-xs">This Month</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{analytics?.clicksThisMonth || 0}</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointerClick className="w-4 h-4 text-orange-400" />
                            <span className="text-white/50 text-xs">Total Clicks</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{analytics?.totalClicks || 0}</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-green-400" />
                            <span className="text-white/50 text-xs">In Stock</span>
                        </div>
                        <p className="text-2xl font-bold text-green-400">{inStock}</p>
                    </div>

                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-white/50 text-xs">Sold Out</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">{outOfStock}</p>
                    </div>
                </div>

                {/* Top Products */}
                {analytics?.topProducts && analytics.topProducts.length > 0 && (
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Products by Clicks</h3>
                        <div className="space-y-3">
                            {analytics.topProducts.map((item, i) => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <span className="text-white/30 w-6 text-sm">{i + 1}.</span>
                                    <div className="flex-1 truncate text-white">{item.product.name}</div>
                                    <span className="text-blue-400 font-medium">{item.clicks} clicks</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Products Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Products</h2>
                        <p className="text-white/50 mt-1">{products.length} total products</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>

                {/* Empty State */}
                {products.length === 0 && !error && (
                    <div className="text-center py-20 border border-white/10 rounded-2xl">
                        <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
                        <p className="text-white/50 mb-6">Add your first product to get started</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
                        >
                            Add Product
                        </button>
                    </div>
                )}

                {/* Product Grid */}
                {products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden group"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-black">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-white/20" />
                                        </div>
                                    )}

                                    {/* Stock Badge */}
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                                        product.in_stock !== false
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {product.in_stock !== false ? 'In Stock' : 'Sold Out'}
                                    </div>

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                        >
                                            <Pencil className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deletingId === product.id}
                                            className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-xs text-blue-400 mb-1">{product.category}</p>
                                    <h3 className="text-white font-semibold mb-1 truncate">{product.name}</h3>
                                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-semibold">
                                            Rp {product.price?.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => toggleStock(product)}
                                            className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                                product.in_stock !== false
                                                    ? 'bg-white/10 hover:bg-white/20 text-white/70'
                                                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                            }`}
                                        >
                                            {product.in_stock !== false ? 'Mark Sold Out' : 'Mark In Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Product Form Modal */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
}
