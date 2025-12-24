import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleLoginSuccess } from "../helpers/handleLoginSuccess";
import authService from "../services/authService";
import { processAfterLogin } from "../helpers/processAfterLogin";

export default function VerifyDevice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.verifyToken) {
    navigate("/login");
    return null;
  }

  const submitOtp = async () => {
    try {
      setLoading(true);

      const res = await authService.verifyDevice({
        verifyToken: state.verifyToken,
        otp,
      });
      if (res.accessToken) {
        await handleLoginSuccess(res.accessToken);
        await processAfterLogin(res.accessToken);
        navigate("/");
        toast.success("Thiết bị đã được xác minh");
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
      {" "}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {" "}
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {" "}
          Xác minh thiết bị mới{" "}
        </h3>{" "}
        <p className="text-gray-600 text-center mb-6">
          {" "}
          Nhập mã OTP đã gửi về email cho thiết bị:{" "}
          <span className="font-bold text-indigo-600">
            {" "}
            {state.deviceName}
          </span>{" "}
        </p>{" "}
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập OTP"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />{" "}
        <button
          onClick={submitOtp}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {" "}
          {loading ? "Đang xác minh..." : "Xác minh"}{" "}
        </button>{" "}
        <button
          onClick={cancel}
          className="w-full mt-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          {" "}
          Hủy{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
