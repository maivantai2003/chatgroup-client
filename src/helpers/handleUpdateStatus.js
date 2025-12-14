import userService from "../services/userService"


export const handleUpdatestatus=async (userId) =>{
    try{
        var userUpdateStatusDto={
            isOnline:true,
            firstLogin:new Date().toISOString(),
            lastLogin:null
        }
        console.log(userId)
        console.log(userUpdateStatusDto)
        var response=await userService.UpdateStatus(userId,userUpdateStatusDto)
        console.log(response.data)
        console.log(userUpdateStatusDto.firstLogin);
    }catch(error){
        console.log("Lỗi cập nhật trạng thái online:", error);
    }
}