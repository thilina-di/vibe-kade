import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const OrderSummary = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  height: fit-content;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: inherit;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: inherit;
`;

const Input = styled.input<{ theme: 'light' | 'dark'; error?: boolean }>`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.error ? '#dc3545' : props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7'};
  border-radius: 4px;
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : 'white'};
  color: inherit;

  &:focus {
    border-color: ${props => props.error ? '#dc3545' : '#0071e3'};
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: inherit;
`;

const SummaryTotal = styled(SummaryItem)`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#3d3d3d' : '#eee'};
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #0071e3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Checkout() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Invalid postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/orders', {
        items,
        total,
        shipping,
        customer: {
          ...formData,
          userId: user?.id
        }
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutContainer>
      <CheckoutForm onSubmit={handleSubmit} theme={theme}>
        <FormSection>
          <h2>Contact Information</h2>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              theme={theme}
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              theme={theme}
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              theme={theme}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              theme={theme}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </FormGroup>
        </FormSection>

        <FormSection>
          <h2>Shipping Address</h2>
          <FormGroup>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={!!errors.address}
              theme={theme}
            />
            {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={!!errors.city}
              theme={theme}
            />
            {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              error={!!errors.postalCode}
              theme={theme}
            />
            {errors.postalCode && <ErrorMessage>{errors.postalCode}</ErrorMessage>}
          </FormGroup>
        </FormSection>
      </CheckoutForm>

      <OrderSummary theme={theme}>
        <h2>Order Summary</h2>
        <SummaryItem>
          <span>Items ({items.length})</span>
          <span>Rs. {subtotal.toLocaleString('en-LK')}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Shipping</span>
          <span>Rs. {shipping.toLocaleString('en-LK')}</span>
        </SummaryItem>
        <SummaryTotal theme={theme}>
          <span>Total</span>
          <span>Rs. {total.toLocaleString('en-LK')}</span>
        </SummaryTotal>
        <PlaceOrderButton type="submit" disabled={isSubmitting || items.length === 0}>
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </PlaceOrderButton>
      </OrderSummary>
    </CheckoutContainer>
  );
} 