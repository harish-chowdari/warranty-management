import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("/admin-signup", { ...signup });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.AlreadyExist) {
        setErrorMessage(res.data.AlreadyExist);
      } else {
        const userId = res.data._id;
        navigate(`/home/add-product`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while signing up. Please try again.");
    }
  };

  return (
  
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {errorMessage && <p>{errorMessage}</p>}

        <div>
          <input
            placeholder="Enter Your Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={signup.name}
          />
        </div>
        <div>
          <input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={signup.email}
          />
        </div>
        <div>
          <input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={signup.password}
          />
        </div>

        <button type="submit">
          Submit
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
