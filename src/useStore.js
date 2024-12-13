import {create} from 'zustand';

const useStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));

export default useStore; 