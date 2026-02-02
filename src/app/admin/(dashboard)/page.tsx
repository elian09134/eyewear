"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Plus, Pencil, Trash2, Package, AlertCircle, BarChart3, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [view, setView] = useState<'products' | 'analytics'>('analytics');

    const fetchProducts = async () => {
        if (!supabase) {
            setError('Supabase not configured. Please add your Supabase credentials to .env.local');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
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
            fetchProducts();
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
            fetchProducts();
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
        fetchProducts();
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

    return (
        <div>
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('analytics')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                            view === 'analytics'
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </button>
                    <button
                        onClick={() => setView('products')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                            view === 'products'
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Products
                    </button>
                </div>

                {view === 'products' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Analytics View */}
            {view === 'analytics' && <AnalyticsDashboard />}

            {/* Products View */}
            {view === 'products' && (
                <>
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
                </>
            )}

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
