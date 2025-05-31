const { products } = require('../data/products');

// Get all products
const getAllProducts = (req, res) => {
    try {
        res.json(products);
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// Get single product
const getProduct = (req, res) => {
    try {
        const { id } = req.params;
        const product = products.find(p => p.id === parseInt(id));
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

// Create new product
const createProduct = (req, res) => {
    try {
        const { name, price, image, category, description } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newProduct = {
            id: products.length + 1,
            name,
            price,
            image,
            category,
            description,
            available: true
        };

        products.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

// Update product
const updateProduct = (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image, category, description, available } = req.body;

        const index = products.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products[index] = {
            ...products[index],
            name: name || products[index].name,
            price: price || products[index].price,
            image: image || products[index].image,
            category: category || products[index].category,
            description: description || products[index].description,
            available: available !== undefined ? available : products[index].available
        };

        res.json(products[index]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

// Delete product
const deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        const index = products.findIndex(p => p.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products.splice(index, 1);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}; 