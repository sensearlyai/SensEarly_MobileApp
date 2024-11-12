// import React, { createContext, useState, useContext, ReactNode } from 'react';

// // Create a context with a default value.
// interface CredentialsContextType {
//   storedCredentials: string | null;
//   setStoredCredentials: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const CredentialsContext = createContext<CredentialsContextType | undefined>(undefined);

// // Create a provider component.
// const CredentialsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [storedCredentials, setStoredCredentials] = useState<string | null>("");

//   return (
//     <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
//       {children}
//     </CredentialsContext.Provider>
//   );
// };

// // Custom hook to use the CredentialsContext.
// const useCredentials = () => {
//   const context = useContext(CredentialsContext);
//   if (!context) {
//     throw new Error('useCredentials must be used within a CredentialsProvider');
//   }
//   return context;
// };

// export { CredentialsProvider, useCredentials };
import { createContext, Dispatch, SetStateAction } from "react";
interface CredentialsType {
  token: string; // Add any other relevant properties as needed
}
interface CredentialsContextType {
  storedCrendentials: object | null;
  setStoredCredentials: Dispatch<SetStateAction<object | null>>;
}

// Correct initialization with proper types and a default function
export const CrendentialsContext = createContext<CredentialsContextType>({
  storedCrendentials: null,
  setStoredCredentials: () => {}, // Default function for initialization
});
