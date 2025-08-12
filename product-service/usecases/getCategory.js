const productRepository = require('../repositories/productRepository');

module.exports = async (category) => {
    try {
        const products = await productRepository.getByCategory(category);
        if (!products || products.length === 0) {
            // Sửa lỗi: Trả về một mảng rỗng thay vì throw lỗi
            return [];
        }
        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            createdAt: product.createdAt,
        }));
    } catch (err) {
        console.error(err);
        // Có thể trả về lỗi hoặc mảng rỗng tùy theo business logic
        throw new Error('Failed to retrieve products by category');
    }
}
