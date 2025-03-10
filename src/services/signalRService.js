import * as signalR from "@microsoft/signalr";
import config from "../constant/linkApi";

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async startConnection() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("Không có token, không thể kết nối SignalR.");
      return;
    }
  
    if (this.connection) {
      if (this.connection.state === signalR.HubConnectionState.Connected || 
          this.connection.state === signalR.HubConnectionState.Connecting) {
        console.log("🔄 SignalR đã kết nối hoặc đang kết nối, không cần kết nối lại.");
        return;
      }
    }
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${config.HUB_URL}`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  
    try {
      await this.connection.start();
      console.log("🔗 SignalR Connected");
    } catch (err) {
      console.error("❌ SignalR Connection Error:", err);
    }
  }

  onEvent(eventName, callback) {
    if (this.connection) {
      this.connection.off(eventName);
      this.connection.on(eventName, callback);
    }
  }

  offEvent(eventName) {
    if (this.connection) {
      this.connection.off(eventName);
    }
  }

  async sendMessage(method, ...args) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke(method, ...args);
    }
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
      console.log("🔌 SignalR Disconnected");
    }
  }
}

const signalRService = new SignalRService();
export default signalRService;
