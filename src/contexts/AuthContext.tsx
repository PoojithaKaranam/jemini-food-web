
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserRole {
  role: 'admin' | 'chef';
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      setUser(user);
      
      if (user) {
        try {
          console.log('Fetching user role for:', user.uid);
          const roleDoc = await getDoc(doc(db, 'userRoles', user.uid));
          
          if (roleDoc.exists()) {
            const roleData = roleDoc.data() as UserRole;
            console.log('User role found:', roleData);
            setUserRole(roleData);
            
            // Navigate to appropriate dashboard based on role
            if (roleData.role === 'chef') {
              console.log('Redirecting to chef panel');
              window.location.href = '/chef';
            } else if (roleData.role === 'admin') {
              console.log('Redirecting to admin dashboard');
              window.location.href = '/admin';
            }
          } else {
            console.log('No role document found for user:', user.uid);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
