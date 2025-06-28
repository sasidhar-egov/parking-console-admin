import React, { createContext, useState, useEffect,useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // { name, role }

  const login = async (userData) => {
    console.log("hiiiiiii dhcb");
    await setAuthUser(prev => ({ ...prev, ...userData }));
    console.log(authUser);
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
