import { create } from 'zustand'

export const useStore = create((set) => ({
    isOpen: false,
    setOpen: (state: boolean) => set(() => ({ isOpen: state })),
}))