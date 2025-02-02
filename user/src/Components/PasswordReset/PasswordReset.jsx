import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PasswordReset.module.css";

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
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2>Password Reset</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className={styles.input}
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
              className={styles.input}
              required
            />

            <input
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              className={styles.input}
              required
            />
          </>
        )}

        <button type="submit" className={styles.button}>
          {isOTPSent ? "Reset Password" : "Send OTP"}
        </button>

        <p className={styles.passwordText}>
          Remember your password?{" "}
          <Link to="/" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default PasswordReset;
