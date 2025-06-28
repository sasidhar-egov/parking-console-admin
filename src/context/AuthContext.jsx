import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // { name, role }

  const login = (userData) => {
    setAuthUser(userData); // e.g. { name: 'Sasi', role: 'admin' }
  };

  const logout = () => {
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for ease of use
export const useAuth = () => useContext(AuthContext);
