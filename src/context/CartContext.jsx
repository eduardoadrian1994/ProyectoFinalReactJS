import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("norte-tech-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("norte-tech-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, quantity = 1) {
    if (!product || quantity <= 0 || product.stock <= 0) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.stock, item.quantity + quantity),
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: Math.min(product.stock, quantity),
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  }

  function removeItem(productId) {
    removeFromCart(productId);
  }

  function getCantidadActual(productId) {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  }

  function isInCart(productId) {
    return cart.some((item) => item.id === productId);
  }

  function updateQuantity(productId, quantity) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.min(item.stock, Math.max(0, quantity)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartTotal() {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    removeItem,
    getCantidadActual,
    isInCart,
    updateQuantity,
    clearCart,
    getCartQuantity,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }
  return context;
}
