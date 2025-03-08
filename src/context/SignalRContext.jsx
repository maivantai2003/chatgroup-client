import { createContext, useContext, useEffect, useState } from "react";
import SignalRService from "../hubs/signalRService";
import { useSelector } from "react-redux"; // Nếu dùng Redux để lấy token

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  //const user = useSelector((state) => state.auth.user); // Lấy token từ Redux
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    // if (user?.token) {
    //   SignalRService.startConnection(user.token).then(() => {
    //     setIsConnected(true);
    //   });
    // }
    const startSignalR = async () => {
        try {
          if (!connection) {
            const conn = await SignalRService.startConnection();
            setIsConnected(true);
            setConnection(conn);
          }
        } catch (error) {
          console.error("SignalR connection error:", error);
          setIsConnected(false);
        }
      };
  
      startSignalR();
  
      return () => {
        if (connection) {
          SignalRService.stopConnection();
        }
      };
  }, []);

  return (
    <SignalRContext.Provider value={{ isConnected, connection }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  return useContext(SignalRContext);
};
