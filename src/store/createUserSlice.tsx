import { StateCreator } from 'zustand';

export interface onlineUsers {
    id: string;
    socketId: string;
}

export type UserType = {
    _id: string;
    firstName: string;
    secondName: string;
    email: string;
    phone: string;
    location: string;
    skills: string[];
    role: string;
    country: string;
    description: string;
    language: string;
    profile: string;
    users: onlineUsers[] | any;
    lastSeen?: string;
};

type State = {
    user: UserType;
};

type Actions = {
    setUser: (user: UserType) => void;
    updateUser: (key: keyof UserType, value: string | string[]) => void;
    clearUser: () => void;
    isProfileComplete: () => boolean;
};

const defaultUser: UserType = {
    _id: '',
    firstName: '',
    secondName: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    role: '',
    description: '',
    language: 'English',
    country: '',
    profile: '',
    users: null
};

const loadUserFromLocalStorage = (): UserType => {
    try {
        const user = localStorage.getItem('userProfile');
        return user ? JSON.parse(user) : defaultUser;
    } catch (error) {
        console.error('Error loading user from localStorage', error);
        return defaultUser;
    }
};

const saveUserToLocalStorage = (user: UserType) => {
    localStorage.setItem('userProfile', JSON.stringify(user));
};

export const createUserSlice: StateCreator<State & Actions> = (set) => ({
    user: loadUserFromLocalStorage(),

    setUser: (user: UserType) => {
        set(() => {
            saveUserToLocalStorage(user);
            return { user: { ...user } };
        });
    },

    updateUser: (key: keyof UserType, value: string | string[]) => {
        set((state) => {
            const updatedUser = { ...state.user, [key]: value };
            saveUserToLocalStorage(updatedUser);
            return { user: updatedUser };
        });
    },

    clearUser: () => {
        set(() => {
            console.log('Clearing user data from localStorage');
            localStorage.removeItem('userProfile');
            return { user: { ...defaultUser } };
        });
    },
    
    isProfileComplete: () => {
        const user = loadUserFromLocalStorage();
        return (
            user.firstName !== '' &&
            user.secondName !== '' &&
            user.email !== '' &&
            user.phone !== '' &&
            user.location !== '' &&
            user.skills.length > 0 &&
            user.country !== '' &&
            user.description !== '' &&
            user.profile !== ''
        );
    }
    
});
