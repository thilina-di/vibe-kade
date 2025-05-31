import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const EmptyCart = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  padding: 3rem 1rem;
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  i {
    font-size: 3rem;
    color: ${props => (props.theme === 'dark' ? '#666' : '#ccc')};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => (props.theme === 'dark' ? '#999' : '#666')};
    margin-bottom: 1.5rem;
  }
`;

const ReturnToShop = styled(Link)`
  display: inline-block;
  padding: 0.8rem 2rem;
  background: #0071e3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #005bbf;
  }
`;

const CartItems = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CartItem = styled.div<{ theme: 'light' | 'dark' }>`
  display: grid;
  grid-template-columns: auto 2fr 1fr 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid
    ${props => (props.theme === 'dark' ? '#3d3d3d' : '#eee')};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: auto 1fr;
    gap: 1rem;
    padding: 1rem;
  }
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#eee')};
  background: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  padding: 0.5rem;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const CartItemDetails = styled.div`
  h3 {
    font-size: 1.1rem;
    margin: 0 0 0.5rem 0;
    color: inherit;
  }

  @media (max-width: 768px) {
    grid-column: 2 / -1;
  }
`;

const CartItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0071e3;

  @media (max-width: 768px) {
    grid-column: 2;
  }
`;

const CartQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-column: 2;
    margin: 0.5rem 0;
  }
`;

const QuantityButton = styled.button<{ theme: 'light' | 'dark' }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#ddd')};
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: inherit;

  &:hover {
    border-color: #0071e3;
    color: #0071e3;
  }
`;

const QuantityInput = styled.input<{ theme: 'light' | 'dark' }>`
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#ddd')};
  border-radius: 4px;
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  color: inherit;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #dc3545;
  }

  @media (max-width: 768px) {
    grid-column: 2;
    justify-self: start;
  }
`;

const CartSummary = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SummaryRow = styled.div<{ total?: boolean; theme: 'light' | 'dark' }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: ${props =>
    props.total ? 'inherit' : props.theme === 'dark' ? '#999' : '#666'};
  font-size: ${props => (props.total ? '1.2rem' : '1rem')};
  font-weight: ${props => (props.total ? '600' : '400')};
  padding-top: ${props => (props.total ? '1rem' : '0')};
  margin-top: ${props => (props.total ? '1rem' : '0')};
  border-top: ${props =>
    props.total
      ? `1px solid ${props.theme === 'dark' ? '#3d3d3d' : '#eee'}`
      : 'none'};
`;

const SummaryTotal = styled.div<{ theme: 'light' | 'dark' }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: ${props => (props.theme === 'dark' ? '#999' : '#666')};
  font-size: 1rem;
  font-weight: 400;
`;

const CheckoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background: #0071e3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1.5rem;

  &:hover {
    background: #005bbf;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CartNotice = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  padding: 1rem;
  background: ${props => (props.theme === 'dark' ? '#1a1a1a' : '#f8f9fa')};
  border-radius: 4px;
  margin-top: 1rem;
  color: ${props => (props.theme === 'dark' ? '#999' : '#666')};
`;

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    shipping,
    total,
    isLoading,
  } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <CartContainer>
        <EmptyCart theme={theme}>
          <i className="fas fa-shopping-cart" />
          <h2>Your cart is currently empty</h2>
          <p>
            Before proceed to checkout you must add some products to your
            shopping cart.
          </p>
          <ReturnToShop to="/products">Return to shop</ReturnToShop>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <h1>Shopping Cart</h1>
      </CartHeader>

      <CartItems theme={theme}>
        {items.map(item => (
          <CartItem key={item.productId} theme={theme}>
            <CartItemImage
              src={item.image}
              alt={item.name}
              theme={theme}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/placeholder.jpg';
              }}
            />
            <CartItemDetails>
              <h3>{item.name}</h3>
            </CartItemDetails>
            <CartItemPrice>
              Rs. {item.price.toLocaleString('en-LK')}
            </CartItemPrice>
            <CartQuantity>
              <QuantityButton
                theme={theme}
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                <i className="fas fa-minus" />
              </QuantityButton>
              <QuantityInput
                type="number"
                value={item.quantity}
                min="1"
                theme={theme}
                onChange={e =>
                  updateQuantity(item.productId, parseInt(e.target.value))
                }
              />
              <QuantityButton
                theme={theme}
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                <i className="fas fa-plus" />
              </QuantityButton>
            </CartQuantity>
            <RemoveButton onClick={() => removeItem(item.productId)}>
              <i className="fas fa-trash-alt" />
            </RemoveButton>
          </CartItem>
        ))}
      </CartItems>

      <CartSummary theme={theme}>
        <h2>Cart Summary</h2>
        <SummaryRow theme={theme}>
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString('en-LK')}</span>
        </SummaryRow>
        <SummaryRow theme={theme}>
          <span>Shipping</span>
          <span>Rs. {shipping.toLocaleString('en-LK')}</span>
        </SummaryRow>
        <SummaryRow total theme={theme}>
          <span>Total</span>
          <span>Rs. {total.toLocaleString('en-LK')}</span>
        </SummaryRow>
        <SummaryTotal theme={theme}>
          <span>Total</span>
          <span>Rs. {total.toLocaleString('en-LK')}</span>
        </SummaryTotal>
        <CheckoutButton
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </CheckoutButton>
        <CartNotice theme={theme}>
          <i className="fas fa-truck" /> Free delivery for orders above Rs.
          15,000
        </CartNotice>
      </CartSummary>
    </CartContainer>
  );
}
