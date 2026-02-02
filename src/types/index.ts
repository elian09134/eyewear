export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    in_stock?: boolean;
    stock_count?: number;
    created_at?: string;
}

export interface Sale {
    id: string;
    customer_name: string;
    customer_phone?: string;
    customer_address?: string;
    product_id?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    products?: Product;
}
