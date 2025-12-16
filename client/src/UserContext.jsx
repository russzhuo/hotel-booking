import { createContext, useEffect, useState } from "react";
import { useUserProfile } from "./data/user";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const { data: userInfo, isLoading, error } = useUserProfile();
  
  useEffect(() => {
    if (!isLoading) {
      setUser(userInfo || null);
      setReady(true);
    }
  }, [userInfo, isLoading]);

  useEffect(() => {
    if (error) {
      setUser(null);
      setReady(true);
    }
  }, [error]);
  
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );

}