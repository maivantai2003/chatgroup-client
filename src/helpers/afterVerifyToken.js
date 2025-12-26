
import { requestPermissionAndGetToken } from "../firebase/firebase";
import { userDevice } from "../services/userDevice";
import { getDeviceName, getOS } from "./getInforDevice";
import { getDeviceType } from "./getDeviceType";
import { toast } from "react-toastify";
import { getDeviceId } from "./getDeviceId";
import { UAParser } from "ua-parser-js";
export const afterVerifyToken=async (userId)=>{
    //const fcmToken = await requestPermissionAndGetToken()
    let fcmToken = null;
    try {
      fcmToken = await requestPermissionAndGetToken();
    } catch {}
    const deviceInfo = navigator.userAgent;
    const deviceType = getDeviceType();
    const parser = new UAParser();
    const ua = parser.getResult();
    const deviceId = await getDeviceId();
    console.log("FCM Token:", fcmToken, deviceInfo, deviceType);
    const userDeviceDto={
        deviceId:deviceId,
        userId: userId,
        deviceToken: fcmToken,
        deviceType: getDeviceType(),
        browser: `${ua.browser.name} ${ua.browser.version}`,
        os: getOS(),
        deviceName: getDeviceName(),
        address: "Không tìm thấy địa chỉ."
    }
    console.log(userDeviceDto);
    var isExistDevide=await userDevice.getUserDevice(userDeviceDto.userId,userDeviceDto.deviceId);
    console.log(isExistDevide);
    if(isExistDevide!==null){
        var response=await userDevice.updateUserDevice(userDeviceDto);
        console.log(response);
        if(!response){
           toast.error("Lỗi xác định thiết bị.");  
        }
    }else{
        toast.error("Có lỗi xảy ra khi xác minh thiết bị.");
    }
}