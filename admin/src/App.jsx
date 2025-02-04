import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PasswordReset from "./pages/auth/PasswordReset";
import AddProduct from "./pages/product/AddProduct";
import Layout from "./Components/Layout/Layout";


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
