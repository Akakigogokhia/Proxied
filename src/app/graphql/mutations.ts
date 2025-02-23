import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register {
    register {
      _id
      token
      cartId
    }
  }
`;

export const ADD_ITEM = gql`
  mutation AddItem($input: AddItemArgs!) {
    addItem(input: $input) {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
          availableQuantity
          isArchived
        }
        quantity
      }
    }
  }
`;

export const REMOVE_ITEM = gql`
  mutation RemoveItem($input: RemoveItemArgs!) {
    removeItem(input: $input) {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
          availableQuantity
          isArchived
        }
        quantity
      }
    }
  }
`;

export const UPDATE_ITEM_QUANTITY = gql`
  mutation UpdateItemQuantity($input: UpdateItemQuantityArgs!) {
    updateItemQuantity(input: $input) {
      _id
      hash
      items {
        _id
        product {
          _id
          title
          cost
          availableQuantity
          isArchived
        }
        quantity
      }
    }
  }
`;
