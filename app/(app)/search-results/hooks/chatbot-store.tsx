import { create } from "zustand";

export const ChatbotStore = create((set) => ({
    productInChatbot: [],
    setProductInChatbot: (updater: any) => 
        set((state: any) => ({
            productInChatbot: typeof updater === 'function' 
                ? updater(state.productInChatbot) 
                : updater 
        })),
    pendingMessage: null,
    addPendingMessage: (message: any) => set({ pendingMessage: message }),
    clearPendingMessage: () => set({ pendingMessage: null }),
}));