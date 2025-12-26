import axios from "axios"
import config from "../constant/linkApi"

export const checkEmail=async(email)=>{
    const result=await axios.get(`${config.API_URL}/user/check-mail?email=`+email)
    return result.data
}