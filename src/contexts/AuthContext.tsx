import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
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
  userDetails: Record<string, any> | null;
  isLoading: boolean;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  userDetails: null,
  isLoading: true
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      
      // Set loading to false once authentication state is determined
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Compute authentication status
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated, 
        userDetails, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
