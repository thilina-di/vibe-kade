import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import App from './App';

describe('App', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
    
    // Verify that the home page title is rendered
    const titleElement = screen.getByText(/vibe-කඩේ/i);
    expect(titleElement).toBeInTheDocument();
  });
});
