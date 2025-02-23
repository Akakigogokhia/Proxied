import { z } from 'zod';
import validator from 'validator';

export const cartAddItemSchema = z.object({
  productId: z.string().refine((input) => validator.isMongoId(input), {
    message: 'Invalid product ID',
  }),
  quantity: z.number().min(1),
});

export const cartRemoveItemSchema = z.object({
  cartItemId: z.string().refine((input) => validator.isMongoId(input), {
    message: 'Invalid cart item ID',
  }),
});

export const cartUpdateItemQuantitySchema = z.object({
  cartItemId: z.string().refine((input) => validator.isMongoId(input), {
    message: 'Invalid cart item ID',
  }),
  quantity: z.number().min(1),
});
