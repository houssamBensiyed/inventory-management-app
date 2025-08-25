// product.interface.ts
export interface Product {
  id: number;
  name: string;
  category: 'Electronics' | 'Accessories' | 'Software';
  price: number;
  quantity: number;
  description: string;
  inStock: boolean;
  lastUpdated: Date;
}
