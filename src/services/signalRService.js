// import * as signalR from "@microsoft/signalr";
// import config from "../constant/linkApi";

// class SignalRService {
//   constructor() {
//     this.connection = null;
//     this.isConnected = false;
//   }

//   async startConnection(token) {
//     if (!token) {
//       console.warn("No token found, skipping SignalR connection.");
//       return;
//     }

//     if (this.connection) {
//       console.log("Stopping existing SignalR connection before reconnecting...");
//       await this.stopConnection();
//     }

//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(`${config.HUB_URL}`, {
//         accessTokenFactory: () => token,
//         // ⚠️ Không dùng phép `|`, chỉ định 1 kiểu transport hoặc bỏ qua để SignalR tự chọn
//         transport: signalR.HttpTransportType.WebSockets,
//         withCredentials: true,
//       })
//       .withAutomaticReconnect([0, 1000, 2000, 5000, 10000])
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     this.connection.onclose((error) => {
//       if (error) {
//         console.log("SignalR Disconnected:", error.message || error);
//       } else {
//         console.log("SignalR Disconnected gracefully");
//       }
//       this.isConnected = false;
//       // ❌ KHÔNG gọi reconnect thủ công nếu dùng .withAutomaticReconnect
//     });

//     this.connection.onreconnecting((error) => {
//       console.log("SignalR Reconnecting...", error);
//     });

//     this.connection.onreconnected(() => {
//       console.log("SignalR Reconnected");
//       this.isConnected = true;
//     });

//     try {
//       await this.connection.start();
//       console.log("SignalR Connected");
//       this.isConnected = true;
//     } catch (err) {
//       console.error("Initial SignalR connection failed:", err.message || err);
//       // ✅ Không cần gọi reconnect thủ công, đã có automatic reconnect
//     }
//   }

//   async stopConnection() {
//     if (this.connection) {
//       try {
//         await this.connection.stop();
//         console.log("SignalR Connection Stopped");
//       } catch (err) {
//         console.error("Error stopping SignalR connection:", err);
//       }
//       this.isConnected = false;
//     }
//   }

//   async updateToken(newToken) {
//     if (!this.connection) return;

//     this.connection.accessTokenFactory = () => newToken;
//     console.log("SignalR Token Updated");

//     if (this.connection.state === signalR.HubConnectionState.Disconnected) {
//       await this.startConnection(newToken);
//     }
//   }

//   getConnection() {
//     return this.connection;
//   }
// }

// export default new SignalRService();

import * as signalR from "@microsoft/signalr";
import config from "../constant/linkApi";

class SignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async startConnection(token) {
        if (!token) {
            console.warn("No token found, skipping SignalR connection.");
            return;
        }

        if (this.connection) {
            console.log("Stopping existing SignalR connection before reconnecting...");
            await this.stopConnection();
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${config.HUB_URL}`, {
                accessTokenFactory: () => token,
                transport: signalR.HttpTransportType.WebSockets|signalR.HttpTransportType.LongPolling,
                withCredentials:true
            })
            .withAutomaticReconnect([0,1000, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.onclose(async (error) => {
            console.log("SignalR Disconnected:", error);
            this.isConnected = false;
            await this.reconnect();
        });

        this.connection.onreconnecting((error) => {
            console.log("SignalR Reconnecting...", error);
        });

        this.connection.onreconnected(() => {
            console.log("SignalR Reconnected");
            this.isConnected = true;
        });

        await this.reconnect();
    }

    async reconnect() {
        let attempts = 0;
        while (attempts < 5) {
            if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
                console.warn("SignalR is not in Disconnected state. Skipping reconnect.");
                return;
            }

            try {
                await this.connection.start();
                console.log("SignalR Connected");
                this.isConnected = true;
                return;
            } catch (err) {
                attempts++;
                console.error(`SignalR Connection Error (Attempt ${attempts}):`, err);
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }

    async stopConnection() {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log("SignalR Connection Stopped");
            } catch (err) {
                console.error("Error stopping SignalR connection:", err);
            }
            this.isConnected = false;
        }
    }
    async updateToken(newToken) {
        if (!this.connection) return;

        this.connection.accessTokenFactory = () => newToken;
        console.log("SignalR Token Updated");

        // ✅ Không dừng connection, chỉ cập nhật token
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            await this.startConnection(newToken);
        }
    }

    getConnection() {
        return this.connection;
    }
}

export default new SignalRService();
