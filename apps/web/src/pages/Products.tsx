import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const FiltersContainer = styled.div<{ theme: 'light' | 'dark' }>`
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  flex: 2;
  min-width: 300px;
  position: relative;

  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => (props.theme === 'dark' ? '#666' : '#999')};
    pointer-events: none;
  }
`;

const SearchInput = styled.input<{ theme: 'light' | 'dark' }>`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7')};
  border-radius: 4px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: ${props =>
    props.theme === 'dark' ? '#1a1a1a' : '#f5f5f7'};
  color: inherit;

  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    outline: none;
    background-color: ${props =>
      props.theme === 'dark' ? '#2d2d2d' : 'white'};
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;

  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => (props.theme === 'dark' ? '#666' : '#999')};
    pointer-events: none;
  }
`;

const Select = styled.select<{ theme: 'light' | 'dark' }>`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7')};
  border-radius: 4px;
  font-size: 0.95rem;
  background-color: ${props =>
    props.theme === 'dark' ? '#1a1a1a' : '#f5f5f7'};
  cursor: pointer;
  appearance: none;
  transition: all 0.2s;
  color: inherit;

  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    outline: none;
    background-color: ${props =>
      props.theme === 'dark' ? '#2d2d2d' : 'white'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
`;

const ProductCard = styled.div<{ theme: 'light' | 'dark' }>`
  background-color: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#eee')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  background-color: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  border-bottom: 1px solid
    ${props => (props.theme === 'dark' ? '#3d3d3d' : '#eee')};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1rem;
    transition: transform 0.2s;
  }
`;

const ProductInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  text-align: center;
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  color: inherit;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0071e3;
  margin: 4px 0;

  &::before {
    content: 'Starting ';
    font-size: 0.8rem;
    font-weight: normal;
    color: ${props => (props.theme === 'dark' ? '#999' : '#666')};
  }
`;

const AddToCartButton = styled.button`
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  text-transform: uppercase;
  font-weight: 500;

  &:hover {
    background-color: #005bbf;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  i {
    font-size: 0.9rem;
  }
`;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { theme } = useTheme();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching products...');
      const response = await api.get<Product[]>('/products');
      console.log('Products response:', response.data);
      setProducts(response.data);
      const uniqueCategories = Array.from(
        new Set(response.data.map((p: Product) => p.category))
      );
      console.log('Unique categories:', uniqueCategories);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const filterProducts = useCallback(() => {
    console.log('Running filter with:', {
      productsLength: products.length,
      searchTerm,
      selectedCategory,
      sortBy,
    });

    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        product => product.category === selectedCategory
      );
      console.log('After category filter:', filtered.length);
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return (a.price || 0) - (b.price || 0);
          case 'price-desc':
            return (b.price || 0) - (a.price || 0);
          case 'name-asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name-desc':
            return (b.name || '').localeCompare(a.name || '');
          default:
            return 0;
        }
      });
      console.log('After sorting:', filtered.length);
    }

    console.log('Setting filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    console.log('Current products:', products);
    console.log('Current filtered products:', filteredProducts);
    console.log('Current search term:', searchTerm);
    console.log('Current category:', selectedCategory);
    console.log('Current sort:', sortBy);
    filterProducts();
  }, [filterProducts]);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProductsContainer>
      <FiltersContainer theme={theme}>
        <SearchBox>
          <i className="fas fa-search" />
          <SearchInput
            type="text"
            placeholder="Search products..."
            onChange={e => handleSearch(e.target.value)}
            theme={theme}
          />
        </SearchBox>
        <FilterGroup>
          <i className="fas fa-filter" />
          <Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            theme={theme}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <i className="fas fa-sort" />
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            theme={theme}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      <ProductsGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} theme={theme}>
            <ProductImage theme={theme}>
              <img
                src={product.image}
                alt={product.name}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/placeholder.jpg';
                }}
              />
            </ProductImage>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice theme={theme}>
                Rs. {product.price.toLocaleString('en-LK')}
              </ProductPrice>
              <AddToCartButton onClick={() => handleAddToCart(product.id)}>
                <i className="fas fa-shopping-cart" />
                Add to Cart
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductsGrid>
    </ProductsContainer>
  );
}
