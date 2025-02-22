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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex-col flex items-center justify-center shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Signup
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>
        )}

        <input
          placeholder="Enter Your Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={signup.name}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          required
        />

        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={signup.email}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          required
        />

        <input
          placeholder="Enter Your Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={signup.password}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Submit
        </button>

        <p className="text-sm text-gray-600 text-center mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
