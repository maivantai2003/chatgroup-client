import { createContext, useEffect, useState } from "react";
import SignalRService from "../services/signalRService";
export const SignalRContext = createContext(null);
export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("accessToken");
      if (!newToken) {
        SignalRService.stopConnection();
        setConnection(null);
      } else {
        setToken(newToken);
        SignalRService.updateToken(newToken);
        setConnection(SignalRService.getConnection());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const initConnection = async () => {
      if (!token) return;
      await SignalRService.startConnection(token);
      setConnection(SignalRService.getConnection());
    };

    initConnection();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      SignalRService.stopConnection();
    };
  }, [token]);
  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};
