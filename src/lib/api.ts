import { supabase } from './supabase';
import { products as mockProducts } from './data';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
    if (!supabase) {
        console.warn('Supabase client not initialized. Using mock data.');
        return mockProducts;
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Error fetching products from Supabase:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn('No products found in Supabase. Falling back to mock data.');
            return mockProducts;
        }

        return data as Product[];
    } catch (err) {
        console.error('Failed to fetch from Supabase, using mock data:', err);
        return mockProducts;
    }
}
