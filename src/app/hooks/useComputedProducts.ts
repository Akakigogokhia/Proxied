import { useState, useEffect } from 'react';

export const useComputedProducts = (productsData: any, cartData: any) => {
  const [computedProducts, setComputedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (productsData?.getProducts?.products && cartData?.getCart?.items) {
      const cartQuantities = cartData.getCart.items.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.product._id] = (acc[item.product._id] || 0) + item.quantity;
          return acc;
        },
        {}
      );
      const updatedProducts = productsData.getProducts.products.map(
        (prod: any) => ({
          ...prod,
          availableNow:
            prod.availableQuantity - (cartQuantities[prod._id] || 0),
        })
      );
      setComputedProducts(updatedProducts);
    }
  }, [productsData, cartData]);

  return computedProducts;
};
