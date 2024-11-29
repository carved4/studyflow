import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect,
  PropsWithChildren
} from 'react';
import { 
  User, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, getUserDetails } from '../config/firebase';

// Define the shape of the AuthContext
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userDetails: Record<string, any> | null;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  userDetails: null
});

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, any> | null>(null);
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
        } catch (error) {
          console.error('Error fetching user details:', error);
          setUserDetails(null);
        }
      } else {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
