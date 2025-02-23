import { useSubscription } from '@apollo/client';
import { CART_ITEM_UPDATE } from '@/app/graphql/subscription';
import { CartItemUpdate, CartItemUpdateData } from '@/types/global';
import { GET_CART } from '@/app/graphql/queries';

interface UseCartItemUpdateParams {
  setNotificationEvents: React.Dispatch<React.SetStateAction<CartItemUpdate[]>>;
  setAcknowledged: (ack: boolean) => void;
}

export const useCartItemUpdate = ({
  setNotificationEvents,
  setAcknowledged,
}: UseCartItemUpdateParams): void => {
  useSubscription<CartItemUpdateData>(CART_ITEM_UPDATE, {
    onData: ({ client, data: subscriptionData }) => {
      const eventData = subscriptionData.data?.cartItemUpdate;
      if (!eventData) return;

      setAcknowledged(false);
      setNotificationEvents((prevData: CartItemUpdate[]) => [
        ...prevData,
        eventData,
      ]);

      const { event, payload } = eventData;

      try {
        client.cache.modify({
          id: `Product:${payload.product._id}`,
          fields: {
            availableQuantity() {
              if (event === 'ITEM_OUT_OF_STOCK') {
                return 0;
              }
              return payload.quantity;
            },
          },
        });

        const cartCache: any = client.cache.readQuery({
          query: GET_CART,
        });

        if (event === 'ITEM_OUT_OF_STOCK') {
          client.cache.modify({
            id: `Cart:${cartCache.getCart._id}`, // Target the Cart
            fields: {
              items(existingItems = [], { readField }) {
                return existingItems.filter(
                  (itemRef: any) => readField('_id', itemRef) !== payload._id
                );
              },
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
