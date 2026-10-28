import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (event) => {
    setCart((currentCart) => {
      const alreadyAdded = currentCart.some(
        (item) => item._id === event._id
      );

      if (alreadyAdded) {
        return currentCart;
      }

      return [...currentCart, event];
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const totalFee = cart.reduce((total, item) => total + item.fee, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        totalFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
