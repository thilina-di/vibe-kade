import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
`;

const RegisterCard = styled.div<{ theme: 'light' | 'dark' }>`
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

const Input = styled.input<{ theme: 'light' | 'dark'; error?: boolean }>`
  padding: 0.8rem;
  border: 1px solid
    ${props =>
      props.error ? '#dc3545' : props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  color: inherit;

  &:focus {
    border-color: ${props => (props.error ? '#dc3545' : '#0071e3')};
    box-shadow: 0 0 0 3px
      ${props =>
        props.error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 113, 227, 0.1)'};
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

const LoginLink = styled(Link)`
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

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(username, password);
      navigate('/');
    } catch (err) {
      setErrors({
        username: 'Username already exists',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard theme={theme}>
        <Title>Create Account</Title>
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
              error={!!errors.username}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
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
              error={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              theme={theme}
              error={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            )}
          </FormGroup>
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </SubmitButton>
        </Form>
        <LoginLink to="/login">Already have an account? Login here</LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
}
