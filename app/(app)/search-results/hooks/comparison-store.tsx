import { create } from "zustand";

interface ComparisonProduct {
  id: string;
  title?: string;
  price?: number;
  sale?: number;
  imurl?: string;
  averageRating?: number;
  [key: string]: any;
}

interface ComparisonState {
  products: ComparisonProduct[];
  comparisonData: any | null;
  productsKey: string | null;
  addProduct: (product: ComparisonProduct) => void;
  prefillComparison: (products: ComparisonProduct[], data: any, key: string) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  canAddProduct: () => boolean;
  setComparisonData: (data: any, key: string | null) => void;
  clearComparisonData: () => void;
}

export const ComparisonStore = create<ComparisonState>((set, get) => ({
  products: [],
  comparisonData: null,
  productsKey: null,
  prefillComparison: (products, data, key) => {
    const sanitizedProducts = products.slice(0, 2);
    set({
      products: sanitizedProducts,
      comparisonData: sanitizedProducts.length === 2 ? data : null,
      productsKey: sanitizedProducts.length === 2 ? key : null,
    });
  },
  addProduct: (product: ComparisonProduct) => {
    const { products } = get();
    // Chỉ cho phép tối đa 2 sản phẩm
    if (products.length >= 2) {
      // Thay thế sản phẩm đầu tiên nếu đã đủ 2
      set({ products: [products[1], product], comparisonData: null, productsKey: null });
    } else if (!products.find(p => p.id === product.id)) {
      // Chỉ thêm nếu chưa có trong danh sách
      const newProducts = [...products, product];
      // Clear comparison data nếu products thay đổi
      if (newProducts.length < 2) {
        set({ products: newProducts, comparisonData: null, productsKey: null });
      } else {
        set({ products: newProducts });
      }
    }
  },
  removeProduct: (productId: string) => {
    set((state) => ({
      products: state.products.filter(p => p.id !== productId),
      comparisonData: null,
      productsKey: null,
    }));
  },
  clearProducts: () => {
    set({ products: [], comparisonData: null, productsKey: null });
  },
  canAddProduct: () => {
    return get().products.length < 2;
  },
  setComparisonData: (data: any, key: string | null) => {
    set({ comparisonData: data, productsKey: key });
  },
  clearComparisonData: () => {
    set({ comparisonData: null, productsKey: null });
  },
}));

