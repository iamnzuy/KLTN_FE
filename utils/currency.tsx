export const formatCurrency = (price: number) => {
  return price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 VND';
};

export const calculateDiscount = (price: number, sale: number) => {
  return Math.round((price - sale) / price * 100);
};