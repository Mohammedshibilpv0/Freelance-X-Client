import create from 'zustand';

// Define the state interface
interface AdminState {
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  clearAdminEmail: () => void;
}

// Function to load admin email from local storage
const loadAdminEmailFromLocalStorage = (): string => {
  try {
    const email = localStorage.getItem('adminEmail');
    return email ? email : '';
  } catch (error) {
    console.error('Error loading admin email from localStorage', error);
    return '';
  }
};

// Function to save admin email to local storage
const saveAdminEmailToLocalStorage = (email: string) => {
  localStorage.setItem('adminEmail', email);
};

// Create the Zustand store
const useAdminStore = create<AdminState>((set) => ({
  adminEmail: loadAdminEmailFromLocalStorage(), // Load from local storage on init

  setAdminEmail: (email) => {
    set({ adminEmail: email });
    saveAdminEmailToLocalStorage(email); // Save to local storage
  },

  clearAdminEmail: () => {
    set({ adminEmail: '' });
    localStorage.removeItem('adminEmail'); // Clear from local storage
  },
}));

export default useAdminStore;
 