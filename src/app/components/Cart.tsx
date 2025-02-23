import React, { useEffect, useRef } from 'react';
import Product from './Product';
import { CartItem } from '@/types/global';

interface CartProps {
  items: CartItem[];
  availableMap: Record<string, number>;
  onRemove: (cartItemId: string) => void;
  onPlus: (cartItemId: string) => void;
  onMinus: (cartItemId: string, currentQuantity: number) => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  availableMap,
  onRemove,
  onPlus,
  onMinus,
}) => {
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevItemsLength = useRef<number>(items.length);

  useEffect(() => {
    if (items?.length > prevItemsLength?.current && lastItemRef?.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    prevItemsLength.current = items.length;
  }, [items]);

  if (!items || items.length === 0) {
    return <p className="text-center text-gray-600">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item._id}
          ref={index === items.length - 1 ? lastItemRef : null}
        >
          <Product
            product={{
              ...item.product,
              availableNow:
                availableMap[item.product._id] !== undefined
                  ? availableMap[item.product._id]
                  : item.product.availableQuantity,
            }}
            mode="cart"
            quantity={item.quantity}
            onPlus={() => onPlus(item._id)}
            onMinus={() => onMinus(item._id, item.quantity)}
            onRemove={() => onRemove(item._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Cart;
