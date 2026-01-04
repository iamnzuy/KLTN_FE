import { create } from "zustand";

export interface CartState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CartStore = create<CartState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));