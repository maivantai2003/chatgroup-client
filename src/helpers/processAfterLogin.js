import { handleCreateInforDevice } from "./handleCreateInforDevice";
//import { handleLoginSuccess } from "./handleLoginSuccess";
import { handleUpdatestatus } from "./handleUpdateStatus";

export const processAfterLogin=async(accessToken,connection)=>{
        var userInfor = JSON.parse(localStorage.getItem("user"));
        var userId = userInfor.UserId;
        // await Promise.all([
        //     handleUpdatestatus(userId),
        //     handleCreateInforDevice(userId)
        // ])
        queueMicrotask(() => {
            Promise.all([
            handleUpdatestatus(userId),
            handleCreateInforDevice(userId)
            ]).catch((err) => {
            console.error("Lỗi khi chạy ngầm các API:", err);
            });
        });
        // await handleUpdatestatus(userId)
        // await handleCreateInforDevice(userId)
        if (connection) {
          connection.off("CheckConnection");
          connection.on("CheckConnection",(value) => {
            console.log(value);
          });
          connection.invoke("LoadRequestFriend", userId.toString());
        }
}