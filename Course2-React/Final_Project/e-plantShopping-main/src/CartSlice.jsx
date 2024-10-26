import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Initialize items as an empty array
  },
  reducers: {
    addItem: (state, action) => {
      const {name, image, cost} = action.payload;
      const isEisting = state.items.find(item => item.name === name);
      if (isEisting) {
        isEisting.quantity += 1;
      }
      else {
        state.items.push({name, image, cost, quantity: 1});
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload['name']);
    },
    updateQuantity: (state, action) => {
      const {name, quantity} = action.payload;
      const isEisting = state.items.find(item => item.name === name);
      if (isEisting) {
        isEisting.quantity = quantity;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;

export default CartSlice.reducer;
