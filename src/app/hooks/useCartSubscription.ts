import { useSubscription } from '@apollo/client';
import { CART_ITEM_UPDATE } from '@/app/graphql/subscription';
import { CartItemUpdate, CartItemUpdateData } from '@/types/global';
import { GET_PRODUCTS, GET_CART } from '@/app/graphql/queries';

interface UseCartItemUpdateParams {
  setNotificationEvents: React.Dispatch<React.SetStateAction<CartItemUpdate[]>>;
  setAcknowledged: (ack: boolean) => void;
}

export const useCartItemUpdate = ({
  setNotificationEvents,
  setAcknowledged,
}: UseCartItemUpdateParams): void => {
  useSubscription<CartItemUpdateData>(CART_ITEM_UPDATE, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log(subscriptionData, 'subscriptionData');
      const eventData = subscriptionData.data?.cartItemUpdate;
      if (!eventData) return;

      setAcknowledged(false);
      setNotificationEvents((prevData: CartItemUpdate[]) => [
        ...prevData,
        eventData,
      ]);

      const { event, payload } = eventData;

      try {
        const productsCache: any = client.readQuery({ query: GET_PRODUCTS });
        if (productsCache) {
          const currentProducts = productsCache.getProducts.products;
          let updatedProducts = currentProducts;

          if (event === 'ITEM_OUT_OF_STOCK') {
            updatedProducts = currentProducts.filter(
              (p: any) => p._id !== payload.product._id
            );
          } else if (event === 'ITEM_QUANTITY_UPDATED') {
            updatedProducts = currentProducts.map((p: any) =>
              p._id === payload.product._id
                ? { ...p, availableQuantity: payload.quantity }
                : p
            );
          }

          client.writeQuery({
            query: GET_PRODUCTS,
            data: {
              getProducts: { products: updatedProducts },
              total: updatedProducts.length,
            },
          });
        }

        const cartCache: any = client.readQuery({ query: GET_CART });
        if (cartCache?.getCart) {
          let updatedCartItems = cartCache.getCart.items;

          if (event === 'ITEM_OUT_OF_STOCK') {
            updatedCartItems = updatedCartItems.filter(
              (item: any) => item.product._id !== payload.product._id
            );
          } else if (event === 'ITEM_QUANTITY_UPDATED') {
            updatedCartItems = updatedCartItems.map((item: any) =>
              item._id === payload._id
                ? {
                    ...item,
                    quantity: payload.quantity,
                    product: payload.product,
                  }
                : item
            );
          }

          client.writeQuery({
            query: GET_CART,
            data: {
              getCart: { ...cartCache.getCart, items: updatedCartItems },
            },
          });
        }
      } catch (error) {
        console.error('Error updating caches:', error);
      }
    },
    onError: (error) => {
      console.error('Error in CartItemUpdate subscription:', error);
    },
  });
};
