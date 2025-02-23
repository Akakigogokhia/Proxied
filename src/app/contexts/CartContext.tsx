'use client';

import { Cart } from '@/types/global';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from 'react';

type CartContextType = {
  cart: Cart | null;
  setCart: Dispatch<SetStateAction<Cart | null>>;
  acknowledged: boolean;
  setAcknowledged: (value: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [acknowledged, setAcknowledged] = useState<boolean>(true);

  return (
    <CartContext.Provider
      value={{ cart, setCart, acknowledged, setAcknowledged }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
