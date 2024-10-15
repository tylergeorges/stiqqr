import { create } from 'zustand';

interface SidebarState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>(set => ({
  isSidebarOpen: false,
  setIsSidebarOpen: isSidebarOpen => set({ isSidebarOpen }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen }))
}));
