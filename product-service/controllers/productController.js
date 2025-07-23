const getAllProducts = require('../usecases/getAllProducts');
const getSingleProduct = require('../usecases/getSingleProduct');
const createProduct = require('../usecases/createProduct');
const updateProduct = require('../usecases/updateProduct');
const searchProducts = require('../usecases/searchProducts');
const deleteProduct = require('../usecases/deleteProduct');
const getProductsByCategory = require('../usecases/getCategory');

module.exports = {
    list: async (req, res) => {
        try {
            const products = await getAllProducts();
            res.status(200).json(products);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve products' });
        }
    },
    get: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await getSingleProduct(id);
            res.status(200).json(product);
        } catch (err) {
            console.error(err);
            res.status(404).json({ error: 'Product not found' });
        }
    },

    create: async (req, res) => {
        try {
            const { id, name, price, description, category, image, origin } = req.body;

            const product = await createProduct(id, name, price, description, category, image, origin);
            res.status(201).json(product);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Failed to create product' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        try {
            var data = {};
            if (req.body.name) data.name = req.body.name;
            if (req.body.price) data.price = req.body.price;
            if (req.body.origin) data.origin = req.body.origin;
            if (req.body.description) data.description = req.body.description;
            if (req.body.image) data.image = req.body.image;
            if (req.body.category) data.category = req.body.category;
            if (req.body.stock) data.stock = req.body.stock;

            const updatedProduct = await updateProduct(id, data);
            res.status(200).json(updatedProduct);
        } catch (err) {
            console.error(err);
            res.status(404).json({ error: 'Product not found or failed to update' });
        }
    },

    search: async (req, res) => {
        const { query } = req.query;
        try {
            const products = await searchProducts(query);
            res.status(200).json(products);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to search products' });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await deleteProduct(id);
            res.status(204).send(); // No content
        } catch (err) {
            console.error(err);
            res.status(404).json({ error: 'Product not found or failed to delete' });
        }
    },

    getByCategory: async (req, res) => {
        const categories = {
            coffee: 'Cà phê',
            tea: 'Trà',
            snack: 'Đồ ăn vặt',
            other: 'Khác'
        };

        try {
            const results = {};
            for (const key in categories) {
                const products = await getProductsByCategory(categories[key]);
                results[key] = products || [];
            }
            res.status(200).json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve products by categories' });
        }
    }
}

