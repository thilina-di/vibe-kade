import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import Checkout from './pages/Checkout';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowGuest>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowGuest>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
