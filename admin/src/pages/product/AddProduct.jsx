import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "../../axios";
import Input from "../../Components/fields/Input";
import TextArea from "../../Components/fields/TextArea";
import Button from "../../Components/fields/Button";

const AddProduct = () => {
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
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
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: handleSubmit,
  });

  // Create/update the image preview whenever formik.values.image changes
  useEffect(() => {
    if (!formik.values.image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(formik.values.image);
    setPreview(objectUrl);

    // Free memory when the component unmounts or when image changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [formik.values.image]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add Product
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              name="name"
              formik={formik}
              placeholder="Product Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div>
            <Input
              name="brand"
              formik={formik}
              placeholder="Brand Name"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div>
            <Input
              name="price"
              type="number"
              formik={formik}
              placeholder="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          
          </div>
          <div>
            <Input
              name="category"
              formik={formik}
              placeholder="Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
           
          </div>
          <div>
            <Input
              name="quantity"
              type="number"
              formik={formik}
              placeholder="Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            
          </div>
          <div>
            {/* Use a native file input to properly capture the file */}
            <label className="block text-sm">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={(event) => {
                if (
                  event.currentTarget.files &&
                  event.currentTarget.files[0]
                ) {
                  console.log("File selected:", event.currentTarget.files[0]);
                  formik.setFieldValue("image", event.currentTarget.files[0]);
                }
              }}
              className="border rounded-sm w-full"
            />
          {formik.errors.image && formik.touched.image && (
              <div className="text-red-500 text-xs">{formik.errors.image}</div>
            )}
          </div>
        </div>
        <div>
          <TextArea
            name="description"
            formik={formik}
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {/* {preview && (
          <div className="mt-4">
            <p className="mb-2 text-gray-700">Image Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain border"
            />
          </div>
        )} */}
        <Button label="Add Product" type="submit" />
      </form>
    </div>
  );
};

export default AddProduct;
