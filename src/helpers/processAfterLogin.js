import { handleUpdatestatus } from "./handleUpdateStatus";
import { afterVerifyToken } from "./afterVerifyToken";
export const processAfterLogin=async(accessToken,connection)=>{
        var userInfor = JSON.parse(localStorage.getItem("user"));
        var userId = userInfor.UserId;
        // queueMicrotask(() => {
        //     Promise.all([
        //     handleUpdatestatus(userId),
        //     handleCreateInforDevice(userId)
        //     ]).catch((err) => {
        //     console.error("Lỗi khi chạy ngầm các API:", err);
        //     });
        // });
        Promise.allSettled([
          handleUpdatestatus(userId),
          afterVerifyToken(userId),
        ]).catch(console.error);
        if (connection) {
          connection.off("CheckConnection");
          connection.on("CheckConnection",(value) => {
            console.log(value);
          });
          connection.invoke("LoadRequestFriend", userId.toString());
        }
}