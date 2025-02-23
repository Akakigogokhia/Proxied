import Cart from '@/app/components/Cart';
import NotificationModal from '@/app/components/NotificationModal';
import ProductList from '@/app/components/ProductList';
import { useCart } from '@/app/contexts/CartContext';
import {
  ADD_ITEM,
  REMOVE_ITEM,
  UPDATE_ITEM_QUANTITY,
} from '@/app/graphql/mutations';
import { GET_PRODUCTS, GET_CART } from '@/app/graphql/queries';
import { CART_ITEM_UPDATE } from '@/app/graphql/subscription';
import { useComputedProducts } from '@/app/hooks/useComputedProducts';
import { cartAddItemSchema } from '@/app/lib/validation';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useState, useEffect } from 'react';

const Home = () => {
  const {
    loading: loadingProducts,
    error: errorProducts,
    data: productsData,
  } = useQuery(GET_PRODUCTS);
  const {
    loading: loadingCart,
    error: errorCart,
    data: cartData,
    refetch: refetchCart,
  } = useQuery(GET_CART, { fetchPolicy: 'network-only' });
  const { refetch: refetchProducts } = useQuery(GET_PRODUCTS);

  const [addItem] = useMutation(ADD_ITEM);
  const [isAdding, setIsAdding] = useState(false);
  const [removeItem] = useMutation(REMOVE_ITEM);
  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY);
  const { setCart, acknowledged, setAcknowledged } = useCart();

  const [notificationEvent, setNotificationEvent] = useState<any>(null);

  const computedProducts = useComputedProducts(productsData, cartData);

  const availableMap = computedProducts.reduce(
    (acc: Record<string, number>, prod: any) => {
      acc[prod._id] = prod.availableNow;
      return acc;
    },
    {}
  );

  //here I try to use the custom hook to only update the necessary product
  // but the response had item with the old quantity so I decided to make both calls to refresh data
  useSubscription(CART_ITEM_UPDATE, {
    onSubscriptionData: async ({ subscriptionData }) => {
      const eventData = subscriptionData.data?.cartItemUpdate;
      console.log(eventData);
      if (eventData) {
        setAcknowledged(false);
        await refetchCart();
        await refetchProducts();
        setNotificationEvent(eventData);
      }
    },
  });

  const handleAcknowledge = () => {
    setNotificationEvent(null);
    setAcknowledged(true);
  };

  const handleAddItem = async (productId: string) => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      cartAddItemSchema.parse({ productId, quantity: 1 });
      const existingItem = cartData.getCart.items.find(
        (item: any) => item.product._id === productId
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        const response = await updateItemQuantity({
          variables: {
            input: { cartItemId: existingItem._id, quantity: newQuantity },
          },
        });
        if (response.data?.updateItemQuantity) {
          setCart(response.data.updateItemQuantity);
          await refetchCart();
        }
      } else {
        const response = await addItem({
          variables: { input: { productId, quantity: 1 } },
        });
        if (response.data?.addItem) {
          setCart(response.data.addItem);
          await refetchCart();
        }
      }
    } catch (err) {
      console.error('Error adding/updating item:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handlePlus = async (cartItemId: string) => {
    try {
      const cartItem = cartData.getCart.items.find(
        (item: any) => item._id === cartItemId
      );
      if (!cartItem) return;
      const newQuantity = cartItem.quantity + 1;
      const response = await updateItemQuantity({
        variables: { input: { cartItemId, quantity: newQuantity } },
      });
      if (response.data?.updateItemQuantity) {
        setCart(response.data.updateItemQuantity);
        await refetchCart();
      }
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  const handleMinus = async (cartItemId: string, currentQuantity: number) => {
    try {
      if (currentQuantity <= 1) {
        const response = await removeItem({
          variables: { input: { cartItemId } },
        });
        if (response.data?.removeItem) {
          setCart(response.data.removeItem);
          await refetchCart();
        }
      } else {
        const newQuantity = currentQuantity - 1;
        const response = await updateItemQuantity({
          variables: { input: { cartItemId, quantity: newQuantity } },
        });
        if (response.data?.updateItemQuantity) {
          setCart(response.data.updateItemQuantity);
          await refetchCart();
        }
      }
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  useEffect(() => {
    if (cartData?.getCart) {
      setCart(cartData.getCart);
    }
  }, [cartData, setCart]);

  return (
    <div className="flex flex-col md:flex-row gap-5 p-5 h-screen">
      <div className="w-full md:w-1/2 flex flex-col gap-5 h-full overflow-auto">
        <h2 className="text-xl font-bold">Products</h2>
        {(loadingProducts || loadingCart) && <p>Loading...</p>}
        {errorProducts && <p>Error loading products.</p>}
        <ProductList products={computedProducts} onAddItem={handleAddItem} />
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-5 h-full overflow-auto">
        <h2 className="text-xl font-bold">Your Cart</h2>
        {errorCart ? (
          <p>Error loading cart.</p>
        ) : (
          cartData?.getCart && (
            <Cart
              items={cartData.getCart.items}
              availableMap={availableMap}
              onRemove={(cartItemId) => handleMinus(cartItemId, 1)}
              onPlus={handlePlus}
              onMinus={handleMinus}
            />
          )
        )}
      </div>

      {notificationEvent && !acknowledged && (
        <NotificationModal
          eventData={notificationEvent}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  );
};

export default Home;
