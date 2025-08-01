const getAllProducts = require('../usecases/getAllProducts');
const getSingleProduct = require('../usecases/getSingleProduct');
const createProduct = require('../usecases/createProduct');
const updateProduct = require('../usecases/updateProduct');
const searchProducts = require('../usecases/searchProducts');
const deleteProduct = require('../usecases/deleteProduct');
const getCategory = require('../usecases/getCategory')

module.exports = {
    list: async (req, res) => {
        try {
            const category = req.query.category || null;
            const price = req.query.price || null;
            const sort = req.query.sort || null;
            
            let products = await getAllProducts();

            if (category) {
                products = products.filter(p => p.category == category);
            }

            if (price == '<30000') {
                products = products.filter(p => p.price < 30000)
            }

            else if (price == '>=30000 & <=50000') {
                products = products.filter(p => p.price >= 30000 && p.price <= 50000)
            }

            else if (price == '>50000') {
                products = products.filter(p => p.price > 50000)
            }

            if (sort == 'asc') {
                products = products.sort((a, b) => a.price - b.price)
            }

            else if (sort == 'desc') {
                products = products.sort((a, b) => b.price - a.price)
            }

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
            const product = await createProduct(req.body);
            res.status(201).json(product);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Failed to create product' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedProduct = await updateProduct(id, req.body);
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
        const categoryMap = {
            'Cà phê': 'coffee',
            'Trà': 'tea',
            'Bánh ngọt': 'dessert',
            'Nước ép': 'juice'
        };

        try {
            const results = {};
            for (const [vn, en] of Object.entries(categoryMap)) {
                const products = await getCategory(vn);
                results[en] = products || [];
            }
            res.status(200).json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve products by categories' });
        }
    }
}

