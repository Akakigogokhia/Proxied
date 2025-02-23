export interface Cart {
  items: CartItem[];
  hash: string;
}

export interface CartItem {
  _id: string;
  product: ProductData;
  quantity: number;
}

export interface ProductData {
  _id: string;
  title: string;
  cost: number;
  availableQuantity: number;
  availableNow: number;
  isArchived: boolean;
}

export type CartItemUpdateEvent = 'ITEM_OUT_OF_STOCK' | 'ITEM_QUANTITY_UPDATED';

export interface CartItemUpdatePayload {
  _id: string;
  product: ProductData;
  quantity: number;
}

export interface CartItemUpdateData {
  cartItemUpdate: CartItemUpdate;
}

export interface CartItemUpdate {
  event: CartItemUpdateEvent;
  payload: CartItemUpdatePayload;
}

export interface GetCartData {
  getCart: Cart;
}

export interface GetProductsData {
  getProducts: {
    products: ProductData[];
  };
}
