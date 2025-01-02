import { create } from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const useStore = create((set, get) => ({
  accessToken: sessionStorage.getItem('accessToken') || null,
  email: sessionStorage.getItem('email') || null,
  socket: null,
  emails: [],

  setAccessToken: (token) => {
    set({ accessToken: token });
    sessionStorage.setItem('accessToken', token);
  },

  setEmail: (email) => {
    set({ email });
    sessionStorage.setItem('email', email);
  },

  initializeSocket: () => {
    const socket = io(SOCKET_URL, {
      auth: {
        token: get().accessToken
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('newEmail', (data) => {
      console.log('New email received:', data);
      get().refreshEmails();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  refreshEmails: async () => {
    const { accessToken } = get();
    try {
      const response = await fetch('http://localhost:5000/api/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      
      const data = await response.json();
      set({ emails: data.emails });
    } catch (error) {
      console.error('Error refreshing emails:', error);
    }
  },

  cleanup: () => {
    get().disconnectSocket();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('email');
    set({ accessToken: null, email: null, emails: [] });
  }
}));

export default useStore;