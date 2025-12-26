import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleLoginSuccess } from "../helpers/handleLoginSuccess";
import authService from "../services/authService";
import { processAfterLogin } from "../helpers/processAfterLogin";
export default function VerifyDevice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!state?.verifyToken) {
      navigate("/login");
    }
  }, [state, navigate]);
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasted)) return;

    setOtp(pasted.split(""));
    document.getElementById("otp-5").focus();
  };
  const submitOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await authService.verifyDevice({
        verifyToken: state.verifyToken,
        otp: otpValue,
      });

      if (res.accessToken) {
        await handleLoginSuccess(res.accessToken);
        await processAfterLogin(res.accessToken);
        toast.success("Thiết bị đã được xác minh");
        navigate("/");
      }
    } catch {
      toast.error("OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };
  const cancel = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Xác minh thiết bị mới
        </h3>

        <p className="text-gray-600 text-center mb-6">
          Nhập mã OTP đã gửi về email cho thiết bị:
          <span className="font-bold text-indigo-600 ml-1">
            {state?.deviceName}
          </span>
        </p>
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>
        <button
          onClick={submitOtp}
          disabled={loading || otp.some((x) => x === "")}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading || otp.some((x) => x === "")
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"}`}>
          {loading ? "Đang xác minh..." : "Xác minh"}
        </button>
        <button
          onClick={cancel}
          className="w-full mt-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
          Hủy
        </button>
      </div>
    </div>
  );
}
