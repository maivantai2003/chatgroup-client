import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import config from "../constant/linkApi";

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async startConnection() {
    if (this.connection && this.connection.state === "Connected") return;

    this.connection = new HubConnectionBuilder()
      .withUrl(`${config.HUB_URL}`, {
       // accessTokenFactory: () => token, // Truyền token nếu cần
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Connected!");
    } catch (error) {
      console.error("SignalR Connection Error: ", error);
      setTimeout(() => this.startConnection(), 5000); // Thử lại sau 5s
    }
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
    }
  }

  on(event, callback) {
    if (this.connection) {
      this.connection.on(event, callback);
    }
  }

  off(event) {
    if (this.connection) {
      this.connection.off(event);
    }
  }

  send(event, data) {
    if (this.connection) {
      this.connection.invoke(event, data);
    }
  }
}

export default new SignalRService();
