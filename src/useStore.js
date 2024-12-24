import {create} from 'zustand';

const useStore = create((set) => ({
  accessToken: sessionStorage.getItem('accessToken') || null,
  setAccessToken: (token) => {
    set({ accessToken: token });
    sessionStorage.setItem('accessToken', token);
  },
  email: sessionStorage.getItem('email') || null,
  setEmail: (email) => {
    set({ email });
    sessionStorage.setItem('email', email);
  },
}));

export default useStore; 