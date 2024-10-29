import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const showCart = useSelector(state => state.cart.showCart);
  const dispatch = useDispatch();

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    var totalAmount = 0;
    cart.forEach(item => {
      var costInNumber = parseFloat(item.cost.replace('$', ''));
      totalAmount += costInNumber * item.quantity;
    });
    return totalAmount.toFixed(2);
  };

  const handleContinueShopping = (e) => {
    onContinueShopping(e);
    console.log('Continue Shopping clicked');
  };



  const handleIncrement = (item) => {
    var itemQuantity = item.quantity + 1;
    dispatch(updateQuantity({ name: item.name, quantity: itemQuantity }));
    
  };

  const handleDecrement = (item) => {
    var itemQuantity = item.quantity;
    if (itemQuantity > 1) {
      itemQuantity -= 1;
    }
    else {
      handleRemove(item);
    }
    dispatch(updateQuantity({ name: item.name, quantity: itemQuantity }));
   
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item));
  };

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
    var costInNumber = parseFloat(item.cost.replace('$', ''));
    return costInNumber * item.quantity;
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount()}</h2>
      <div>
        {cart.map(item => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>
              <div className="cart-item-quantity">
                <button className="cart-item-button cart-item-button-dec" onClick={() => handleDecrement(item)}>-</button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button className="cart-item-button cart-item-button-inc" onClick={() => handleIncrement(item)}>+</button>
              </div>
              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
              <button className="cart-item-delete" onClick={() => handleRemove(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', color: 'black' }} className='total_cart_amount'></div>
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={(e) => handleContinueShopping(e)}>Continue Shopping</button>
        <br />
        <button className="get-started-button1">Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;

