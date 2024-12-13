import {create} from 'zustand';

const useStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  email: null,
  setEmail: (email) => set({ email }),
}));

export default useStore; 