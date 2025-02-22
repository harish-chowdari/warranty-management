import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PasswordReset from "./pages/auth/PasswordReset";
import AddProduct from "./pages/product/AddProduct";
import Layout from "./Components/Layout/Layout";
import ViewProducts from "./pages/product/ViewProducts";
import EditProduct from "./pages/product/EditProduct";
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <div>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element= {<Signup />} />
            <Route path="/reset" element= {<PasswordReset/>} />
            <Route path="/home" element={<Layout />}>
                <Route path="add-product" element={<AddProduct />} />
                <Route path="view-products" element={<ViewProducts />} />
                <Route path="edit-product/:productId" element={<EditProduct />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
};

export default App;
