"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { X, Minus, Plus, User, Phone, MapPin, ShoppingBag } from 'lucide-react';

interface SalesFormProps {
    products: Product[];
    onClose: () => void;
    onSave: () => void;
}

export function SalesForm({ products, onClose, onSave }: SalesFormProps) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedProduct = products.find(p => p.id === selectedProductId);
    const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;
    const availableStock = selectedProduct?.stock_count || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase || !selectedProduct) {
            setError('Please select a product');
            return;
        }

        if (quantity > availableStock) {
            setError(`Only ${availableStock} items in stock`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Record the sale
            const { error: saleError } = await supabase.from('sales').insert([{
                customer_name: customerName,
                customer_phone: customerPhone || null,
                customer_address: customerAddress || null,
                product_id: selectedProduct.id,
                quantity,
                unit_price: selectedProduct.price,
                total_price: totalPrice
            }]);

            if (saleError) throw saleError;

            // Update stock count
            const newStock = availableStock - quantity;
            const { error: stockError } = await supabase
                .from('products')
                .update({ 
                    stock_count: newStock,
                    in_stock: newStock > 0
                })
                .eq('id', selectedProduct.id);

            if (stockError) throw stockError;

            onSave();
        } catch (err: any) {
            setError(err.message || 'Failed to record sale');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Record Sale</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-white/50" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Customer Info */}
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-white/40 font-medium">Customer Info</p>
                        
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Customer name"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="Phone number (optional)"
                            />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                            <textarea
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors resize-none"
                                placeholder="Address (optional)"
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-white/40 font-medium">Product</p>
                        
                        <select
                            value={selectedProductId}
                            onChange={(e) => { setSelectedProductId(e.target.value); setQuantity(1); }}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Select a product...</option>
                            {products.filter(p => (p.stock_count || 0) > 0).map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - Rp {product.price.toLocaleString('id-ID')} ({product.stock_count} in stock)
                                </option>
                            ))}
                        </select>

                        {selectedProduct && (
                            <div className="flex items-center justify-between p-4 bg-black/50 rounded-xl border border-white/5">
                                <span className="text-white/60 text-sm">Quantity</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="w-4 h-4 text-white" />
                                    </button>
                                    <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    {selectedProduct && (
                        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60">Total</span>
                                <span className="text-2xl font-bold text-white">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedProduct}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Recording...' : 'Record Sale'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
