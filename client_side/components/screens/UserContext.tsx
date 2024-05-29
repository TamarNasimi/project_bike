
import React, { createContext, useState, useContext, ReactNode } from 'react';
//הגדרת טיפוס משתמש
type User = {
  id: string;
  email: string;
};
//הגדרת צורת הקשר-האם המשתמש מחובר או שלא
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
//רכיב גלובלי שניתן לגשת אליו ולעדכן את מצב המשתמש
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
//יציאה מהמשתמש המחובר
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
