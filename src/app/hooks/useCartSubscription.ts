// useCartItemUpdate.ts
import { useSubscription } from '@apollo/client';
import { CART_ITEM_UPDATE } from '@/app/graphql/subscription';
import { useCart } from '@/app/contexts/CartContext';
import { Cart, ProductData } from '@/types/global';

export interface CartItem {
  _id: string;
  product: ProductData;
  quantity: number;
}

export type CartItemUpdateEvent = 'ITEM_OUT_OF_STOCK' | 'ITEM_QUANTITY_UPDATED';

export interface CartItemUpdatePayload {
  _id: string;
  product: ProductData;
  quantity: number;
}

export interface CartItemUpdateData {
  cartItemUpdate: {
    event: CartItemUpdateEvent;
    payload: CartItemUpdatePayload;
  };
}

interface UseCartItemUpdateParams {
  refetchProducts: () => Promise<any>;
  setNotificationEvent: (event: CartItemUpdateData['cartItemUpdate']) => void;
  setAcknowledged: (ack: boolean) => void;
}

export const useCartItemUpdate = ({
  refetchProducts,
  setNotificationEvent,
  setAcknowledged,
}: UseCartItemUpdateParams): void => {
  const { cart, setCart } = useCart();

  useSubscription<CartItemUpdateData>(CART_ITEM_UPDATE, {
    onSubscriptionData: async ({ subscriptionData }) => {
      console.log(subscriptionData, 'subscriptionData');
      const eventData = subscriptionData.data?.cartItemUpdate;
      if (!eventData || !cart) return;

      setAcknowledged(false);
      // await refetchProducts();
      setNotificationEvent(eventData);

      const { event, payload } = eventData;
      setCart((prevCart: Cart | null) => {
        console.log(prevCart, 'prevCart');
        console.log(payload, 'payload');
        if (!prevCart) return prevCart;
        let updatedItems = prevCart.items;

        if (event === 'ITEM_OUT_OF_STOCK') {
          updatedItems = prevCart.items.filter(
            (item) => item.product._id !== payload.product._id
          );
        } else if (event === 'ITEM_QUANTITY_UPDATED') {
          updatedItems = prevCart.items.map((item) =>
            item._id === payload._id
              ? {
                  ...item,
                  quantity: payload.quantity,
                  product: payload.product,
                }
              : item
          );
        }

        return { ...prevCart, items: updatedItems };
      });
    },
    onError: (error) => {
      console.error('Error in CartItemUpdate subscription:', error);
    },
  });
};
