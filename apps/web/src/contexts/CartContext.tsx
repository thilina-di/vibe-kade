import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import api from '../lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
  productId: string;
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
const GUEST_CART_KEY = 'guest_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  const calculateTotals = useCallback(() => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const newShipping = newSubtotal > 15000 ? 0 : 350; // Free shipping over Rs. 15,000
    const newTotal = newSubtotal + newShipping;
    setSubtotal(newSubtotal);
    setShipping(newShipping);
    setTotal(newTotal);
  }, [items]);

  // Load cart data
  useEffect(() => {
    void loadCart();
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        // Load cart from API for authenticated users
        const response = await api.get('/cart');
        if (response.data && Array.isArray(response.data.items)) {
          setItems(response.data.items);
        }
      } else {
        // Load cart from localStorage for guests
        const guestCart = localStorage.getItem(GUEST_CART_KEY);
        if (guestCart) {
          setItems(JSON.parse(guestCart));
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        // Add item to API cart for authenticated users
        const response = await api.post('/cart', {
          productId: parseInt(productId),
          quantity,
        });
        if (response.data && Array.isArray(response.data.items)) {
          setItems(response.data.items);
        }
      } else {
        // Add item to localStorage cart for guests
        const product = await api.get(`/products/${productId}`);
        const newItem: CartItem = {
          productId,
          name: product.data.name,
          price: product.data.price,
          quantity,
          image: product.data.image,
        };
        
        const updatedItems = [...items];
        const existingItem = updatedItems.find(item => item.productId === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          updatedItems.push(newItem);
        }
        
        setItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (isAuthenticated) {
        // Remove item from API cart for authenticated users
        const response = await api.delete(`/cart/${parseInt(productId)}`);
        if (response.data && Array.isArray(response.data.items)) {
          setItems(response.data.items);
        }
      } else {
        // Remove item from localStorage cart for guests
        const updatedItems = items.filter(item => item.productId !== productId);
        setItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      
      if (isAuthenticated) {
        // Update quantity in API cart for authenticated users
        const response = await api.put(`/cart/${parseInt(productId)}`, {
          quantity,
        });
        if (response.data && Array.isArray(response.data.items)) {
          setItems(response.data.items);
        }
      } else {
        // Update quantity in localStorage cart for guests
        const updatedItems = items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
      }
      toast.success('Cart updated');
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        // Clear API cart for authenticated users
        await api.delete('/cart');
      }
      // Clear cart for both authenticated and guest users
      setItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [items, calculateTotals]);

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
        total,
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
