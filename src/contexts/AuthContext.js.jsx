import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserDetails } from '../config/firebase';
// Create the AuthContext with a default value
const AuthContext = createContext({
    currentUser: null,
    isAuthenticated: false,
    isLoading: true,
    userDetails: null
});
// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Fetch additional user details from Firestore
                    const details = await getUserDetails(user.uid);
                    setUserDetails(details);
                }
                catch (error) {
                    console.error('Error fetching user details:', error);
                    setUserDetails(null);
                }
            }
            else {
                setUserDetails(null);
            }
            setIsLoading(false);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);
    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        userDetails
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
