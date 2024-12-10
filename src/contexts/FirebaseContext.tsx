import React, { createContext, useContext, useEffect, useState } from 'react'; 
import {  
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  UserCredential, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth'; 
import { auth } from '../config/firebase'; 
 
interface AuthContextType { 
  currentUser: User | null; 
  loading: boolean; 
  signup: (email: string, password: string) => Promise<UserCredential>; 
  login: (email: string, password: string) => Promise<UserCredential>; 
  logout: () => Promise<void>; 
  updatePassword: (user: User, newPassword: string) => Promise<void>; 
  reauthenticateWithCredential: (user: User, credential: any) => Promise<UserCredential>; 
  EmailAuthProvider: typeof EmailAuthProvider; 
} 
 
const AuthContext = createContext<AuthContextType>({} as AuthContextType); 
 
export const useAuth = () => useContext(AuthContext); 
 
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
  const [currentUser, setCurrentUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true); 
 
  const signup = (email: string, password: string): Promise<UserCredential> => { 
    return createUserWithEmailAndPassword(auth, email, password); 
  }; 
 
  const login = (email: string, password: string): Promise<UserCredential> => { 
    return signInWithEmailAndPassword(auth, email, password); 
  }; 
 
  const logout = () => { 
    return signOut(auth); 
  }; 
 
  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (user) => { 
      setCurrentUser(user); 
      setLoading(false); 
    }); 
 
    return unsubscribe; 
  }, []); 
 
  const value = { 
    currentUser, 
    loading, 
    signup, 
    login, 
    logout, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
  }; 
 
  return ( 
    <AuthContext.Provider value={value}> 
      {!loading && children} 
    </AuthContext.Provider> 
  ); 
}; 