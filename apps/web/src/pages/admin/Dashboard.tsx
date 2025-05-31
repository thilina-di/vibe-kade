import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  available: boolean;
}

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active?: boolean; theme: 'light' | 'dark' }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: ${props =>
    props.active ? '#0071e3' : props.theme === 'dark' ? '#2d2d2d' : 'white'};
  color: ${props => (props.active ? 'white' : 'inherit')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.active
        ? '#005bbf'
        : props.theme === 'dark'
          ? '#3d3d3d'
          : '#f5f5f7'};
  }
`;

const Table = styled.table<{ theme: 'light' | 'dark' }>`
  width: 100%;
  border-collapse: collapse;
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid
      ${props => (props.theme === 'dark' ? '#3d3d3d' : '#eee')};
  }

  th {
    background: ${props => (props.theme === 'dark' ? '#1a1a1a' : '#f5f5f7')};
    font-weight: 500;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => (props.variant === 'danger' ? '#dc3545' : '#0071e3')};
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background: ${props =>
      props.variant === 'danger' ? '#c82333' : '#005bbf'};
  }

  & + & {
    margin-left: 0.5rem;
  }
`;

const StatusBadge = styled.span<{ status: Order['status'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#17a2b8';
      case 'shipped':
        return '#0071e3';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};
  color: white;
`;

const Modal = styled.div<{ theme: 'light' | 'dark' }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => (props.theme === 'dark' ? '#2d2d2d' : 'white')};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  background: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  color: inherit;

  &:focus {
    border-color: #0071e3;
    outline: none;
  }
`;

const Select = styled.select<{ theme: 'light' | 'dark' }>`
  padding: 0.8rem;
  border: 1px solid ${props => (props.theme === 'dark' ? '#3d3d3d' : '#d2d2d7')};
  border-radius: 4px;
  background: ${props => (props.theme === 'dark' ? '#1a1a1a' : 'white')};
  color: inherit;

  &:focus {
    border-color: #0071e3;
    outline: none;
  }
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const productData = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      image: formData.get('image'),
      available: formData.get('available') === 'true',
    };

    try {
      if (editingProduct) {
        await axios.put(
          `/api/admin/products/${editingProduct.id}`,
          productData
        );
        toast.success('Product updated successfully');
      } else {
        await axios.post('/api/admin/products', productData);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;

    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order['status']
  ) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <DashboardContainer>
      <TabsContainer>
        <Tab
          active={activeTab === 'products'}
          onClick={() => setActiveTab('products')}
          theme={theme}
        >
          Products
        </Tab>
        <Tab
          active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          theme={theme}
        >
          Orders
        </Tab>
      </TabsContainer>

      {activeTab === 'products' && (
        <>
          <ActionButton
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            Add New Product
          </ActionButton>

          <Table theme={theme}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price.toLocaleString('en-LK')}</td>
                  <td>{product.available ? 'Available' : 'Unavailable'}</td>
                  <td>
                    <ActionButton
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {activeTab === 'orders' && (
        <Table theme={theme}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.items.length} items</td>
                <td>Rs. {order.total.toLocaleString('en-LK')}</td>
                <td>
                  <StatusBadge status={order.status}>
                    {order.status}
                  </StatusBadge>
                </td>
                <td>
                  <Select
                    value={order.status}
                    onChange={e =>
                      handleUpdateOrderStatus(
                        order.id,
                        e.target.value as Order['status']
                      )
                    }
                    theme={theme}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {isModalOpen && (
        <>
          <Overlay onClick={() => setIsModalOpen(false)} />
          <Modal theme={theme}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <Form onSubmit={handleProductSubmit}>
              <FormGroup>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={editingProduct?.name}
                  required
                  theme={theme}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="category">Category</Label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  defaultValue={editingProduct?.category}
                  required
                  theme={theme}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  defaultValue={editingProduct?.price}
                  required
                  min="0"
                  step="0.01"
                  theme={theme}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <Input
                  as="textarea"
                  name="description"
                  id="description"
                  defaultValue={editingProduct?.description}
                  required
                  theme={theme}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  type="url"
                  name="image"
                  id="image"
                  defaultValue={editingProduct?.image}
                  required
                  theme={theme}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="available">Availability</Label>
                <Select
                  name="available"
                  id="available"
                  defaultValue={editingProduct?.available?.toString()}
                  theme={theme}
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </Select>
              </FormGroup>
              <ActionButton type="submit">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </ActionButton>
            </Form>
          </Modal>
        </>
      )}
    </DashboardContainer>
  );
}
