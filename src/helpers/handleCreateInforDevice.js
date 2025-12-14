
import { toast } from "react-toastify";
import { requestPermissionAndGetToken } from "../firebase/firebase";
import { userDevice } from "../services/userDevice";
// import config from "../constant/linkApi";
import { getDeviceName, getOS } from "./getInforDevice";
export const handleCreateInforDevice=async (userId)=>{
    const fcmToken = await requestPermissionAndGetToken()
            const deviceInfo = navigator.userAgent;
            const deviceType = "web";
            console.log("FCM Token:", fcmToken, deviceInfo, deviceType);
    const userDeviceDto={
        userId: userId,
        deviceToken: fcmToken,
        deviceType: "web",
        browser: navigator.userAgent,
        os: getOS(),
        deviceName: getDeviceName(),
        address: "Không tìm thấy địa chỉ."
    }
    var result=await userDevice.createUserDevice(userDeviceDto)
    if(!result){
        toast.error("Lỗi Khi Thêm Thông Tin Thiết Bị")
    }     
}