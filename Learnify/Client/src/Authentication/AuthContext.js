// import React, { createContext, useState, useContext } from 'react';
// import { login as loginService } from '../../../Server/routers/';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     try {
//       const data = await loginService(email, password);
//       localStorage.setItem('token', data.token);
//       setUser(data.user); // Save user in context
//     } catch (error) {
//       console.error('Login error:', error.message);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
