// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState } from 'react';

// Extend the User interface to include the isVerified field
interface User {
    email: string;
    password: string;
    isVerified: boolean;  // New field for email verification status
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        // Logic to authenticate the user

        const authenticatedUser = await authenticateUser(email, password);
        if (authenticatedUser) {
            if (!authenticatedUser.isVerified) {
                throw new Error('Email is not verified. Please verify your email before logging in.');
            }

            setUser(authenticatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Assume this function connects to backend to authenticate
const authenticateUser = async (email: string, password: string) => {
    // Simulated backend request
    return new Promise<User | null>((resolve) => {
        setTimeout(() => {
            // Simulated logged-in user object
            resolve({ email, password, isVerified: true }); // Replace true with actual verification status
        }, 1000);
    });
};
