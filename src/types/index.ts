export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    in_stock?: boolean;
    created_at?: string;
}
