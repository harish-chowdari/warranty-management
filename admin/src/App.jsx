import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import PasswordReset from "./Components/PasswordReset/PasswordReset";
import AddProduct from "./Components/AddProduct/AddProduct";
import Layout from "./Layout/Layout";

const App = () => {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element= {<Signup />} />
        <Route path="/reset" element= {<PasswordReset/>} />
        <Route path="/home" element={<Layout />}>
            <Route path="add-product" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
      
      
    </div>
  );
};

export default App;
