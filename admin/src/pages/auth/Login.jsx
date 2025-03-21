import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // stage "login" for initial email/password and "otp" for OTP verification stage
  const [stage, setStage] = useState("login");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Submit handler for email & password
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);
      const res = await axios.post("/admin-login", { ...loginData });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.NotExist) {
        setErrorMessage(res.data.NotExist);
      } else if (res.data.Incorrect) {
        setErrorMessage(res.data.Incorrect);
      } else if (res.data.message === "OTP sent to your email") {
        // If credentials are valid and OTP sent, switch to OTP stage
        setStage("otp");
      } else {
        setErrorMessage("Unexpected response from server.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit handler for OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {

      const res = await axios.post("/verify-admin-login-otp", {
        email: loginData.email,
        verify2FAOtP: otp,
      });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.NotExist) {
        setErrorMessage(res.data.NotExist);
      } else if (res.data.Incorrect) {
        setErrorMessage(res.data.Incorrect);
      } else if (res.data.Expired) {
        setErrorMessage(res.data.Expired);
      } else if (res.data.message === "OTP verified, login successful") {
        // Upon successful OTP verification, navigate to the home page (or another route)
        // localStorage.setItem("adminId", res.data.adminId);
        navigate(`/home/add-product`);
      } else {
        setErrorMessage("Unexpected response from server.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {stage === "login" ? (
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white flex-col flex items-center justify-center shadow-lg rounded-2xl p-8 w-96"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Login
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-3">
              {errorMessage}
            </p>
          )}

          <input
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={loginData.email}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <input
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <p className="text-sm text-gray-600 text-center mb-3">
            Forgot password? Update{" "}
            <Link to="/reset" className="text-blue-500 hover:underline">
              here
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? 'Sending Otp...' : 'Submit'}
          </button>

          <p className="text-sm text-gray-600 text-center mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      ) : (
        // OTP Verification Form
        <form
          onSubmit={handleOtpSubmit}
          className="bg-white flex-col flex items-center justify-center shadow-lg rounded-2xl p-8 w-96"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Verify OTP
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-3">
              {errorMessage}
            </p>
          )}

          <p className="text-sm text-gray-600 text-center mb-3">
            An OTP has been sent to your email: {loginData.email}
          </p>

          <input
            placeholder="Enter OTP"
            type="text"
            name="otp"
            onChange={handleOtpChange}
            value={otp}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
