// import * as signalR from "@microsoft/signalr";
// import config from "../constant/linkApi";

// const SignalRService = (function () {
//   let connection = null;

//   const startConnection = async () => {
//     if (!connection) {
//       connection = new signalR.HubConnectionBuilder()
//         .withUrl(`${config.HUB_URL}`, {
//           accessTokenFactory: () => localStorage.getItem("accessToken"),
//         })
//         .withAutomaticReconnect([0, 2000, 5000, 10000])
//         .configureLogging(signalR.LogLevel.Information)
//         .build();

//       connection.onclose(async (error) => {
//         console.log("SignalR Disconnected", error);
//         setTimeout(async () => {
//           console.log("Attempting to reconnect...");
//           await startConnection();
//         }, 5000);
//       });
//     }

//     if (connection.state === signalR.HubConnectionState.Disconnected) {
//       let attempts = 0;
//       while (attempts < 5) { // Thử lại tối đa 5 lần
//         try {
//           await connection.start();
//           console.log("SignalR Connected");
//           return;
//         } catch (err) {
//           attempts++;
//           console.error(`SignalR Connection Error (Attempt ${attempts}):`, err);
//           await new Promise((resolve) => setTimeout(resolve, 5000)); // Chờ 5s trước khi thử lại
//         }
//       }
//     }
//   };

//   const stopConnection = async () => {
//     if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
//       await connection.stop();
//       console.log("SignalR Connection Stopped");
//     }
//   };

//   const getConnection = () => connection;

//   return {
//     startConnection,
//     stopConnection,
//     getConnection,
//   };
// })();

// export default SignalRService;
import * as signalR from "@microsoft/signalr";
import config from "../constant/linkApi";

const SignalRService = (function () {
  let connection = null;

  const startConnection = async () => {
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
      console.log("SignalR is already connected or connecting...");
      return;
    }

    if (!connection) {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.HUB_URL}`, {
          accessTokenFactory: () => localStorage.getItem("accessToken"),
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 1000, 3000, 5000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Khi mất kết nối, SignalR sẽ tự động reconnect, không cần gọi startConnection()
      connection.onclose((error) => {
        console.log("SignalR Disconnected:", error);
      });

      connection.onreconnecting((error) => {
        console.log("SignalR Reconnecting...", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR Reconnected with connectionId:", connectionId);
      });
    }

    let attempts = 0;
    while (attempts < 3) {
      try {
        await connection.start();
        console.log("SignalR Connected");
        return;
      } catch (err) {
        attempts++;
        console.error(`SignalR Connection Error (Attempt ${attempts}):`, err);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  const stopConnection = async () => {
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
      await connection.stop();
      console.log("SignalR Connection Stopped");
    }
  };

  const getConnection = () => connection;

  return {
    startConnection,
    stopConnection,
    getConnection,
  };
})();

export default SignalRService;
