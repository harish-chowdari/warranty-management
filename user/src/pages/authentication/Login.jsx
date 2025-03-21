import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      setIsLoading(true);
      const res = await axios.post("/user-login", { ...login });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.NotExist) {
        setErrorMessage(res.data.NotExist);
      } else if (res.data.Incorrect) {
        setErrorMessage(res.data.Incorrect);
      } else if (res.data.message === "OTP sent to your email") {
        setUserId(res.data.userId);
        setStep(2);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(userId);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("/verify-user-login-otp", {
        email: login.email,
        verify2FAOtP: otp,
      });

      if (res.data.Incorrect) {
        setErrorMessage(res.data.Incorrect);
      } else if (res.data.Expired) {
        setErrorMessage(res.data.Expired);
      } else if (res.data.message === "OTP verified, login successful") {
        localStorage.setItem("userId", userId);
        navigate(`/home/view-products`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {step === 1 ? (
        <form onSubmit={handleSubmit} className="bg-white flex-col flex items-center justify-center shadow-lg rounded-2xl p-8 w-96">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Login</h2>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>
          )}

          <input
            placeholder="Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={login.email}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <input
            placeholder="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={login.password}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <p className="text-sm text-gray-600 text-center mb-3">
            Forgot password? Update <Link to="/reset" className="text-blue-500 hover:underline">here</Link>
          </p>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} hover:bg-blue-600 transition-all`}
          >
            {isLoading ? "Sending Otp..." : "Submit"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-3">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="bg-white flex-col flex items-center justify-center shadow-lg rounded-2xl p-8 w-96">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Verify OTP</h2>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>
          )}

          <input
            placeholder="Enter OTP"
            type="text"
            required
            onChange={handleOtpChange}
            value={otp}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
