import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import styled from '@emotion/styled';

const LayoutContainer = styled.div<{ theme: 'light' | 'dark' }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme === 'dark' ? '#1a1a1a' : '#f5f5f7'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#1d1d1f'};
`;

const Header = styled.header<{ theme: 'light' | 'dark' }>`
  background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: saturate(180%) blur(20px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7'};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
    padding: 0.75rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
    z-index: 100;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: inherit;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${props => props.$active ? 1 : 0.7};

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 0.8rem;
    gap: 0.25rem;
  }
`;

const CartBadge = styled.span`
  background: #0071e3;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const Main = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
`;

const Footer = styled.footer<{ theme: 'light' | 'dark' }>`
  background-color: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  padding: 2rem;
  text-align: center;
  border-top: 1px solid ${props => props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7'};
`;

const ThemeToggle = styled.button<{ theme: 'light' | 'dark' }>`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <LayoutContainer theme={theme}>
      <Header theme={theme}>
        <Nav>
          <Logo to="/">vibe-කඩේ</Logo>
          <NavLinks theme={theme}>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/cart">
              Cart {cartItemsCount > 0 && <CartBadge>{cartItemsCount}</CartBadge>}
            </NavLink>
            {user ? (
              <>
                {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                <NavLink to="#" onClick={logout}>Logout</NavLink>
              </>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
            <ThemeToggle theme={theme} onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </ThemeToggle>
          </NavLinks>
        </Nav>
      </Header>
      <Main>{children}</Main>
      <Footer theme={theme}>
        <p>© 2024 vibe-කඩේ. All rights reserved.</p>
      </Footer>
    </LayoutContainer>
  );
} 