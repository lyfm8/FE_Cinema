import { useMemo, useState } from 'react';
import { CartContext } from '@/store/cart/cartStore';

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    setItems((current) => [...current, item]);
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(
    () => ({
      items,
      addItem,
      clearCart,
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartProvider };
export default CartProvider;
