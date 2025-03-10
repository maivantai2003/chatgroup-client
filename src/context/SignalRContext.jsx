import { createContext, useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import config from "../constant/linkApi";

const SignalRContext = createContext(null);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("❌ No access token found. Skipping SignalR connection.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.HUB_URL}`, {
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => localStorage.getItem("accessToken"),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ SignalR Connected");
        setConnection(newConnection);
      })
      .catch((err) => console.error("❌ SignalR Connection Error:", err));

    // Cleanup khi component unmount
    return () => {
      if (newConnection) {
        newConnection.stop();
        console.log("🔴 SignalR Disconnected");
      }
    };
  }, []);

  return <SignalRContext.Provider value={connection}>{children}</SignalRContext.Provider>;
};

export const useSignalR = () => {
  const connection = useContext(SignalRContext);
  if (!connection) {
    console.warn("⚠️ useSignalR must be used within a SignalRProvider");
  }
  return connection;
};
