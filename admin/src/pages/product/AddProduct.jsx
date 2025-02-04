import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "../../axios";
import Input from "../../Components/fields/Input";
import TextArea from "../../Components/fields/TextArea";
import Button from "../../Components/fields/Button";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    image: null,
  });


  const handleSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    try {
      const response = await axios.post("/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product added:", response.data);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };


  const formik = useFormik({
    initialValues: {
      name: "",
      brand: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      brand: Yup.string().required("Brand is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().required("Price is required"),
      category: Yup.string().required("Category is required"),
      quantity: Yup.number().required("Quantity is required"),
      // image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Product</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-2 ">
        <div className="grid grid-cols-2 gap-4">
        <div className=""><Input name="name" formik={formik} placeholder="Product Name"/></div>
        <div><Input name="brand" formik={formik} placeholder="Brand Name"/></div>
        <div><Input name="price" type="number" formik={formik} placeholder="Price"/></div>
        <div><Input name="category" formik={formik} placeholder="Category"/></div>
        <div><Input name="quantity" type="number" formik={formik} placeholder="Quantity"/></div>
        <div><Input name="image" type="file" formik={formik} placeholder="Image"/></div>
</div>
        <div><TextArea name="description" formik={formik} placeholder="Description"/></div>
        <Button label="Add Product" type="submit" />
      </form>
    </div>
  );
};

export default AddProduct;
