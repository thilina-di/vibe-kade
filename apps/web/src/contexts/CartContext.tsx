import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  subtotal: number;
  total: number;
  shipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items]);

  const calculateTotals = () => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newShipping = newSubtotal > 15000 ? 0 : 350; // Free shipping over Rs. 15,000
    setSubtotal(newSubtotal);
    setShipping(newShipping);
    setTotal(newSubtotal + newShipping);
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/cart');
      setItems(response.data.items);
    } catch (error) {
      toast.error('Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      const response = await axios.post('/api/cart/items', { productId, quantity });
      setItems(response.data.items);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
      throw error;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete(`/api/cart/items/${productId}`);
      setItems(items.filter(item => item.id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      const response = await axios.put(`/api/cart/items/${productId}`, { quantity });
      setItems(response.data.items);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        isLoading,
        subtotal,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 