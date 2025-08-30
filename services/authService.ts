
import { User } from '../types';

const USERS_KEY = 'artisanAiUsers';
const SESSION_KEY = 'artisanAiSession';

// Helper to get all users from localStorage
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save all users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const register = (userData: Omit<User, 'id'>): User => {
  const users = getUsers();
  const lowercasedEmail = userData.email.toLowerCase();

  if (users.some(u => u.email === lowercasedEmail)) {
    throw new Error('A user with this email already exists.');
  }

  const newUser: User = {
    id: Date.now().toString(),
    ...userData,
    email: lowercasedEmail,
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  
  // Automatically log in the new user
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  
  return newUser;
};


export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const lowercasedEmail = email.toLowerCase();
  const user = users.find(u => u.email === lowercasedEmail);

  if (user && user.password === password) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  const sessionJson = localStorage.getItem(SESSION_KEY);
  return sessionJson ? JSON.parse(sessionJson) : null;
};

export const updateUser = (updatedUser: User): User => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);

    if (userIndex === -1) {
        throw new Error("User not found and could not be updated.");
    }

    // Preserve the password from the original user object
    const originalPassword = users[userIndex].password;
    const userToSave = { ...updatedUser, password: originalPassword };

    // Update the user in the list
    users[userIndex] = userToSave;
    saveUsers(users);

    // Update the session as well if it's the current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userToSave));
    }

    return userToSave;
};