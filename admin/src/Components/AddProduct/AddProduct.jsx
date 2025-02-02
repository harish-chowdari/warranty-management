import React from 'react'
import { useState } from 'react';

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        description: "",
        image: [],
        price: "",
        category: "",
        quantity: ""
    })
   
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };
  
    return (
        <div>
            AddProduct
        </div>
    )
}

export default AddProduct