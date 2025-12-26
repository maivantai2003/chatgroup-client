import { UAParser } from "ua-parser-js";

export const getDeviceType=()=>{
  const parser = new UAParser();
  const device = parser.getDevice();
  if (!device.type) return "web";
  if (device.type === "mobile") return "mobile";
  if (device.type === "tablet") return "tablet";
  return device.type;
}