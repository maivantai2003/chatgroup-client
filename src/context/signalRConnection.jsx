// signalRConnection.jsx
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import config from "../constant/linkApi";
let connection;

export function getConnection() {
  if (!connection) {
    const token = localStorage.getItem("accessToken")
    connection = new HubConnectionBuilder()
      .withUrl(`${config.HUB_URL}`, {
        //transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents |  HttpTransportType.LongPolling,
        accessTokenFactory:()=>token,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    connection.serverTimeoutInMilliseconds = 2 * 60 * 1000;
    if (connection.state === "Disconnected" || connection.state === "Connecting") {
        connection
          .start()
          .then(() => console.log("🔗 SignalR connected"))
          .catch((err) => console.error("🚨 SignalR connection failed:", err));
      }
  }
  return connection;
}

export default getConnection;
