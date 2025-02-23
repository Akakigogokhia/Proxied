import { ProductData } from '@/types/global';
import React from 'react';

interface ProductProps {
  product: ProductData;
  mode: 'list' | 'cart';
  quantity?: number;
  onAdd?: () => void;
  onPlus?: () => void;
  onMinus?: () => void;
  onRemove: (productId: string) => void;
}

const Product: React.FC<ProductProps> = ({
  product,
  mode,
  quantity,
  onAdd,
  onPlus,
  onMinus,
  onRemove,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {product.title}
      </h2>
      <p className="text-gray-700 mb-4">Cost: ${product.cost}</p>
      {mode === 'list' ? (
        <>
          <p className="text-gray-600">
            Fully Available: {product.availableQuantity}
          </p>
          <p className="text-gray-600 mb-4">
            Available Now: {product.availableNow}
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onAdd}
            disabled={product.availableNow === 0}
          >
            Add to Cart
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700 mb-2">Quantity: {quantity}</p>
          <div className="flex space-x-2 mb-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition"
              onClick={onMinus}
            >
              -
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onPlus}
              disabled={product.availableNow === 0}
            >
              +
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
              onClick={() => onRemove(product._id)}
            >
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
