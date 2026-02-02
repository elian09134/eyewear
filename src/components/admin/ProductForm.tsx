"use client";

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { X, Upload, Loader2 } from 'lucide-react';

interface ProductFormProps {
    product?: Product | null;
    onClose: () => void;
    onSave: () => void;
}

export function ProductForm({ product, onClose, onSave }: ProductFormProps) {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [description, setDescription] = useState(product?.description || '');
    const [category, setCategory] = useState(product?.category || '');
    const [image, setImage] = useState(product?.image || '');
    const [inStock, setInStock] = useState(product?.in_stock ?? true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !supabase) return;

        setUploading(true);
        setError('');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('Product')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('Product')
                .getPublicUrl(filePath);

            setImage(publicUrl);
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError('Supabase not configured');
            return;
        }

        setLoading(true);
        setError('');

        const productData = {
            name,
            price: parseFloat(price),
            description,
            category,
            image,
            in_stock: inStock,
        };

        try {
            if (product) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);
                if (error) throw error;
            } else {
                // Create new product
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            onSave();
        } catch (err: any) {
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white/50" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Product Image
                        </label>
                        <div className="relative">
                            {image ? (
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                                    <img src={image} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-white/50" />
                                            <span className="text-white/50 text-sm">Click to upload</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., Classic Aviator"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Price (Rp)
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., 250000"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g., Sunglasses"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Short description of the product..."
                            required
                        />
                    </div>

                    {/* In Stock Toggle */}
                    <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/10">
                        <span className="text-white">In Stock</span>
                        <button
                            type="button"
                            onClick={() => setInStock(!inStock)}
                            className={`w-12 h-6 rounded-full transition-colors ${inStock ? 'bg-green-500' : 'bg-white/20'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${inStock ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (product ? 'Update' : 'Add Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
