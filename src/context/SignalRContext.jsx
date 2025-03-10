import { createContext, useEffect, useState } from "react";
import SignalRService from "../services/signalRService";

export const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    SignalRService.startConnection().then(() => {
      setConnection(SignalRService.getConnection());
    });

    return () => {
      SignalRService.stopConnection();
    };
  }, []);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};
