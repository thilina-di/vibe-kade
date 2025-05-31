import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Hero = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #0071e3, #005bbf);
  color: white;
  border-radius: 12px;
  margin: 2rem auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    margin: 1rem;
    border-radius: 8px;

    h1 {
      font-size: 2rem;
    }
  }
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #0071e3;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  margin-top: 2rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;

const FeatureCard = styled.div<{ theme: 'light' | 'dark' }>`
  text-align: center;
  padding: 2rem;
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  i {
    font-size: 2.5rem;
    color: #0071e3;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: inherit;
  }

  p {
    color: ${props => (props.theme === 'dark' ? '#999' : '#666')};
    font-size: 0.9rem;
  }
`;

export default function Home() {
  const { theme } = useTheme();

  return (
    <HomeContainer>
      <Hero theme={theme}>
        <h1>Welcome to vibe-කඩේ</h1>
        <p>Discover our amazing collection of products at unbeatable prices.</p>
        <ShopNowButton to="/products">Shop Now</ShopNowButton>
      </Hero>

      <FeaturesGrid>
        <FeatureCard theme={theme}>
          <i className="fas fa-shipping-fast" />
          <h3>Fast Delivery</h3>
          <p>Free delivery for orders above Rs. 15,000</p>
        </FeatureCard>
        <FeatureCard theme={theme}>
          <i className="fas fa-shield-alt" />
          <h3>Secure Payments</h3>
          <p>Multiple secure payment options available</p>
        </FeatureCard>
        <FeatureCard theme={theme}>
          <i className="fas fa-headset" />
          <h3>24/7 Support</h3>
          <p>Round the clock customer support</p>
        </FeatureCard>
        <FeatureCard theme={theme}>
          <i className="fas fa-undo" />
          <h3>Easy Returns</h3>
          <p>Hassle-free return policy</p>
        </FeatureCard>
      </FeaturesGrid>
    </HomeContainer>
  );
}
