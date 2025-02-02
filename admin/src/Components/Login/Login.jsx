import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; 

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const res = await axios.post("/admin-login", { ...login });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.NotExist) {
        setErrorMessage(res.data.NotExist);
      } else if (res.data.Incorrect) {
        setErrorMessage(res.data.Incorrect);
      } else {
        const userId = res.data._id; 
        navigate(`/home/${userId}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <input
          placeholder="Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={login.password}
          className={styles.input}
        />
        <p className={styles.resetPassword}>
          Forget password? update{" "}
          <Link to="/reset" className={styles.link}>
            {" "}
            here
          </Link>
        </p>
        <button type="submit" className={styles.button}>
          Submit
        </button>

        <p className={styles.text}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.link}>
            Signup
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
