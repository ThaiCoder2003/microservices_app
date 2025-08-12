const Products = require('../infrastructure/models/Products');
const connectDB = require('../config/db');

const seedProducts = async () => {
    try {
        await connectDB();
        const count = await Products.countDocuments();
        if (count > 0) {
            console.log('⚠️ Products already exist. Skipping seeding.');
            return;
        }

        const demoProducts = [
            {
                id: 'CF001',
                name: 'Cà phê sữa đá',
                price: 30000,
                description: 'Cà phê đậm đà pha cùng sữa đặc, đặc trưng của Việt Nam.',
                origin: 'Việt Nam',
                category: 'Cà phê',
                image: 'ca-phe-sua-da.jpg',
            },
            {
                id: 'CF002',
                name: 'Cà phê đen nóng',
                price: 25000,
                description: 'Cà phê nguyên chất, đậm vị, không đường.',
                origin: 'Việt Nam',
                category: 'Cà phê',
                image: 'ca-phe-den-nong.jpg',
            },
            {
                id: 'TE001',
                name: 'Trà sen',
                price: 35000,
                description: 'Trà ướp hương sen, nhẹ nhàng và thư giãn.',
                origin: 'Việt Nam',
                category: 'Trà',
                image: 'tra-sen.png',
            },
            {
                id: 'TE002',
                name: 'Trà đào cam sả',
                price: 40000,
                description: 'Hương vị trái cây và thảo mộc tươi mát.',
                origin: 'Việt Nam',
                category: 'Trà',
                image: 'tra-dao-cam-sa.jpg',
            },
            {
                id: 'DS001',
                name: 'Bánh tiramisu',
                price: 45000,
                description: 'Bánh ngọt kiểu Ý, mềm mịn, vị cà phê và cacao.',
                origin: 'Ý',
                category: 'Bánh ngọt',
                image: 'tiramisu.jpg',
            },
            {
                id: 'DS002',
                name: 'Bánh su kem',
                price: 30000,
                description: 'Vỏ giòn, nhân kem ngọt dịu.',
                origin: 'Pháp',
                category: 'Bánh ngọt',
                image: 'banh-su-kem.jpg',
            },
            {
                id: 'JU001',
                name: 'Nước ép cam',
                price: 35000,
                description: 'Nước cam tươi nguyên chất, giàu vitamin C.',
                origin: 'Việt Nam',
                category: 'Nước ép',
                image: 'nuoc-ep-cam.jpg',
            },
            {
                id: 'JU002',
                name: 'Nước ép dưa hấu',
                price: 30000,
                description: 'Giải khát tức thì với dưa hấu mát lạnh.',
                origin: 'Việt Nam',
                category: 'Nước ép',
                image: 'nuoc-ep-dua-hau.jpeg',
            },
        ];

        for (const product of demoProducts) {
            await Products.create({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                origin: product.origin,
                product: product.category
            });
            console.log(`✅ Seeded product: ${product.name}`);
        }

        console.log('✅ Products seeded!');
    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } 
};
// Export hàm seedProducts thay vì gọi nó trực tiếp
seedProducts();
