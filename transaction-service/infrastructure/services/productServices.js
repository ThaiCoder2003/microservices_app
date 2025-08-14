const axios = require('axios');

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL;

module.exports = {
    async getProductById(productId) {
        try {
            const response = await axios.get(`${PRODUCT_SERVICE}/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${productId}:`, error);
            throw new Error('Failed to fetch product');
        }
    }
}
