import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ViewCart from "./pages/product/ViewCart";
import ViewProducts from "./pages/product/ViewProducts";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import PasswordReset from "./pages/authentication/PasswordReset";
import Layout from "./Components/Layout/Layout";
import ProductDetails from "./pages/product/ProductDetails";
import ViewPurchases from "./pages/product/ViewPurchases";
import Scanner from "./pages/product/Scanner";
import ViewWarranties from "./pages/product/ViewWarranties";
import { Toaster } from "react-hot-toast";
import ClaimWarranty from "./pages/product/ClaimWarranty";
import WarrantyDetails from "./pages/product/WarrantyDetails";
import AllProducts from "./pages/product/AllProducts";
import Details from "./pages/product/Details";


const App = () => {

  return (
    <div>
        <Toaster position="top-center" />

        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element= {<Signup />} />
                <Route path="/reset" element= {<PasswordReset/>} />
                <Route path="/" element={<AllProducts />}/>
                <Route path="/details/:productId" element={<Details />}/>

                <Route path="/home" element={<Layout />}>
                    <Route path="view-products" element={<ViewProducts />}/>
                    <Route path="product-details/:productId" element={<ProductDetails />}/>
                    <Route path="view-cart" element={<ViewCart />}/>
                    <Route path="view-purchases" element={<ViewPurchases/>}/>
                    <Route path="scanner" element={<Scanner />}/>
                    <Route path="claim-warranty/:productId" element={<ClaimWarranty/>}/>
                    <Route path="view-warranties" element={<ViewWarranties/>}/>
                    {/* warranty details */}
                    <Route path="warranty-details" element={<WarrantyDetails/>}/>
                    {/* all prdocts */}
                </Route>
                </Routes>
        </BrowserRouter>
      
      
    </div>
  );
};

export default App;
