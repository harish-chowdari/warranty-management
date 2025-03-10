import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [login, setLogin] = useState({ email: "", otp: "", newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOTPSent) {
      try {
        const res = await axios.post("/send-user-otp", { email: login.email });

        if (res.data.emailRequire) {
          setErrorMessage("Please enter your email address.");
        } else if (res.data.userNotExist) {
          setErrorMessage("No account found with this email address.");
        } else if (res.data.msg === "OTP sent successfully") {
          alert("OTP has been sent to your email. Please check your inbox.");
          setIsOTPSent(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred. Please try again.");
      }
    } else {
      try {
        const res = await axios.post("/update-user-password", {
          email: login.email,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res.data.otpNotValid) {
          setErrorMessage("Invalid OTP. Please try again.");
        } else if (res.data.otpExpired) {
          setErrorMessage("OTP has expired. Please request a new one.");
        } else if (res.data.updatedPassword) {
          alert("Password updated successfully! You can now log in.");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred while updating the password.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col items-center justify-center shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Password Reset
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-3">
            {errorMessage}
          </p>
        )}

        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          required
        />

        {isOTPSent && (
          <>
            <input
              placeholder="Enter OTP"
              type="text"
              name="otp"
              onChange={handleChange}
              value={login.otp}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
              required
            />

            <input
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          {isOTPSent ? "Reset Password" : "Send OTP"}
        </button>

        <p className="text-sm text-gray-600 text-center mt-3">
          Remember your password?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default PasswordReset;
