const getAllProducts = require('../usecases/getAllProducts');
const getSingleProduct = require('../usecases/getSingleProduct');
const createProduct = require('../usecases/createProduct');
const updateProduct = require('../usecases/updateProduct');
const searchProducts = require('../usecases/searchProducts');
const deleteProduct = require('../usecases/deleteProduct');
const getCategory = require('../usecases/getCategory')

const Status = require('../infrastructure/models/status.model')
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
            let data = {}
            const { id, name, image, price, origin, description, category } = req.body;
            if (!id || !name || !price) {
                res.status(404).json('Id, name and price must be included!');
            }

            data.id = id;
            data.name = name;
            data.price = price;
            if (image) data.image = image;
            if (origin) data.origin = origin;
            if (description) data.description = description
            if (category) data.category = category
            const result = await createProduct(data);
            res.status(result.status).json({ eventId: result.eventId, message: result.message });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ error: 'No product id!' })
        }
        const { name, image, price, origin, description, category } = req.body;
        if (!name && !image && !price && !origin && !description && !category) {
            return res.status(404).json({ error: 'At least 1 field must be filled!' })
        }

        const updateData = {}
        if (name) updateData.name = name;
        if (image) updateData.image = image;
        if (price) updateData.price = price;
        if (origin) updateData.origin = origin;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        try {
            
            const updatedResult = await updateProduct(id, updateData);
            res.status(updatedResult.status).json({ eventId: updatedResult.eventId, message: updatedResult.message });
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
            const deleteResult = await deleteProduct(id);
            res.status(deleteResult.status).send({ eventId: deleteResult.eventId, message: deleteResult.message }); // No content
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
    },

    getStatus: async (req, res) => {
        try {
            const { eventId } = req.params;
            if (!eventId)
                return res.status(404).json({ error: "There's no event Id to check!" })
            const getStatus = await Status.findOne({ eventId });
            return res.json({ status: getStatus.status })
        } catch (err) {
            return res.status(500).json({ error: 'Cannot retrieve status' });
        }
    }
}
