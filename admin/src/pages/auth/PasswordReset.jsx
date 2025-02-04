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
        const res = await axios.post("/send-admin-otp", { email: login.email });

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
        const res = await axios.post("/update-admin-password", {
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
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Password Reset</h2>
        {errorMessage && <p >{errorMessage}</p>}

        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
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
              required
            />

            <input
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              required
            />
          </>
        )}

        <button type="submit" >
          {isOTPSent ? "Reset Password" : "Send OTP"}
        </button>

        <p>
          Remember your password?{" "}
          <Link to="/">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default PasswordReset;
