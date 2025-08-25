import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './product.interface';
import { ProductList } from './product-list/product-list';
import { ProductForm } from './product-form/product-form';
import { SearchBar } from './search-bar/search-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductList, ProductForm, SearchBar],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'Inventory Management System';
  darkMode = false;
  showForm = false;
  editingProduct: Product | null = null;
  searchTerm = '';
  sortBy: 'name' | 'price' | 'quantity' = 'name';

  products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      price: 1299.99,
      quantity: 25,
      description: 'High-performance laptop with 16GB RAM',
      inStock: true,
      lastUpdated: new Date(),
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 29.99,
      quantity: 4,
      description: 'Ergonomic wireless mouse with USB-C',
      inStock: true,
      lastUpdated: new Date(),
    },
    {
      id: 3,
      name: 'Antivirus Software',
      category: 'Software',
      price: 49.99,
      quantity: 100,
      description: '1-year subscription for 3 devices',
      inStock: true,
      lastUpdated: new Date(),
    },
    {
      id: 4,
      name: 'USB-C Hub',
      category: 'Accessories',
      price: 79.99,
      quantity: 0,
      description: '7-in-1 USB-C hub with HDMI',
      inStock: false,
      lastUpdated: new Date(),
    },
    {
      id: 5,
      name: 'Monitor 27"',
      category: 'Electronics',
      price: 399.99,
      quantity: 15,
      description: '4K UHD IPS Display',
      inStock: true,
      lastUpdated: new Date(),
    },
  ];

  get filteredProducts(): Product[] {
    let filtered = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'quantity':
          return a.quantity - b.quantity;
        default:
          return 0;
      }
    });
  }

  get totalInventoryValue(): number {
    return this.products.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  get lowStockProducts(): Product[] {
    return this.products.filter((p) => p.quantity > 0 && p.quantity < 5);
  }

  onSeachChange(term: string): void {
    this.searchTerm = term;
  }

  onDeleteProduct(productId: number): void {
    this.products = this.products.filter((p) => p.id !== productId);
  }

  onEditProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showForm = true;
  }

  onQuantityChange(data: { productId: number; change: number }): void {
    const product = this.products.find((p) => p.id === data.productId);
    if (product) {
      product.quantity = Math.max(0, product.quantity + data.change);
      product.inStock = product.quantity > 0;
      product.lastUpdated = new Date();
    }
  }

  onProductSubmit(product: Product): void {
    if (this.editingProduct) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.products[index] = { ...product, lastUpdated: new Date() };
      }
    } else {
      const newProduct: Product = {
        ...product,
        id: Math.max(...this.products.map((p) => p.id), 0) + 1,
        lastUpdated: new Date(),
      };
      this.products.push(newProduct);
    }
    this.onFormCancel();
  }

  onFormCancel(): void {
    this.showForm = false;
    this.editingProduct = null;
  }

  showAddForm(): void {
    this.editingProduct = null;
    this.showForm = true;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
  }

  onSortChange(sortBy: 'name' | 'price' | 'quantity'): void {
    this.sortBy = sortBy;
  }
}
