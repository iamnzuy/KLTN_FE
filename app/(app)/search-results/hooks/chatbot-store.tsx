import { create } from "zustand";

export const ChatbotStore = create((set) => ({
    productInChatbot: [],
    setProductInChatbot: (updater: any) => 
        set((state: any) => ({
            productInChatbot: typeof updater === 'function' 
                ? updater(state.productInChatbot) 
                : updater 
        })),
    clearProductInChatbot: () => set({ productInChatbot: [] }),
    removeProductFromChatbot: (productId: string) => set((state: any) => ({ productInChatbot: state.productInChatbot.filter((product: any) => product.id !== productId) })),
    pendingMessage: null,
    addPendingMessage: (message: any) => set({ pendingMessage: message }),
    clearPendingMessage: () => set({ pendingMessage: null }),
}));