import { ProductData } from '@/types/global';
import React from 'react';
import Product from './Product';

interface ProductListProps {
  products: ProductData[];
  onAddItem: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddItem }) => {
  return (
    <div>
      {products.map((product) => (
        <Product
          key={product._id}
          product={product}
          mode="list"
          onAdd={() => onAddItem(product._id)}
          onRemove={() => {}}
        />
      ))}
    </div>
  );
};

export default ProductList;
