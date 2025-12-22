const mockChatbotProducts = Array.from({ length: 20 }).map((_, i) => ({
    id: `${1000 + i}`,
    title: `Sản phẩm ${i + 1}`,
    imurl: `https://via.placeholder.com/300x300?text=Sản+phẩm+${i + 1}`,
    price: (Math.round((Math.random() * 200 + 10) * 100) / 100),
}));

export default mockChatbotProducts;
