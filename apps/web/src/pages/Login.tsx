import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
`;

const LoginCard = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: inherit;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: inherit;
`;

const Input = styled.input<{ theme: 'light' | 'dark' }>`
  padding: 0.8rem;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7')};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  color: inherit;

  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #005bbf;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled(Link)`
  text-align: center;
  display: block;
  margin-top: 1.5rem;
  color: #0071e3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      // Login successful - redirect will happen via useEffect
      // If user is admin, redirect to admin dashboard
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard theme={theme}>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              theme={theme}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              theme={theme}
              disabled={isSubmitting}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </SubmitButton>
        </Form>
        <RegisterLink to="/register">
          Don&apos;t have an account? Register here
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
}
