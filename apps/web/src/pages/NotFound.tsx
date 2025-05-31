import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';

const NotFoundContainer = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const NotFoundCard = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #0071e3;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  color: inherit;
`;

const Description = styled.p<{ theme: 'light' | 'dark' }>`
  color: ${props => props.theme === 'dark' ? '#999' : '#666'};
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  background: #0071e3;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #005bbf;
  }
`;

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <NotFoundContainer>
      <NotFoundCard theme={theme}>
        <ErrorCode>404</ErrorCode>
        <Title>Page Not Found</Title>
        <Description theme={theme}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Description>
        <HomeLink to="/">Return to Home</HomeLink>
      </NotFoundCard>
    </NotFoundContainer>
  );
} 