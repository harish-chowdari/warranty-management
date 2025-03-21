import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

import axios from "../../axios";
import Input from "../../Components/fields/Input";
import TextArea from "../../Components/fields/TextArea";
import Button from "../../Components/fields/Button";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(`/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    getProductDetails();
  }, [productId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      modelNo: product?.modelNo || "",
      brand: product?.brand || "",
      mfgDate: product?.mfgDate ? new Date(product?.mfgDate).toISOString().split("T")[0] : "",
      warrantyTermsAndConditions: product?.warrantyTermsAndConditions || "",
      warrantyInDays: product?.warrantyInDays || "",
      coverage: product?.coverage || "",
      price: product?.price || "",
      category: product?.category || "",
      quantity: product?.quantity || "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      modelNo: Yup.string().required("Model No is required"),
      brand: Yup.string().required("Brand is required"),
      mfgDate: Yup.date().required("Manufacturing Date is required"),
      warrantyTermsAndConditions: Yup.string().required("Warranty Terms & Conditions are required"),
      warrantyInDays: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .required("Warranty days is required")
        .min(1, "Warranty must be at least 1 day"),
      coverage: Yup.string().required("Coverage is required"),
      price: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .required("Price is required"),
      category: Yup.string().required("Category is required"),
      quantity: Yup.number()
        .transform((value, originalValue) => (originalValue === "" ? undefined : value))
        .required("Quantity is required")
        .min(1, "Minimum quantity is 1"),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      try {
        const response = await axios.put(`/edit-product/${productId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Product updated:", response.data);
        toast.success("Product updated successfully");
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
  });


  useEffect(() => {
    if (!formik.values.image) {
      setPreview(product?.image && product.image[0] ? product.image[0] : null);
      return;
    }
    const objectUrl = URL.createObjectURL(formik.values.image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formik.values.image, product]);

  if (!product) {
    return <div className="text-center mt-10">Loading product details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Product</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              name="name"
              formik={formik}
              label="Product Name"
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
              label="Brand"
              placeholder="Brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              name="mfgDate"
              type="date"
              formik={formik}
              label="Manufacturing Date"
              placeholder="Manufacturing Date"
              value={formik.values.mfgDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          
          <div>
            <Input
              name="warrantyInDays"
              type="number"
              formik={formik}
              label="Warranty (Days)"
              placeholder="Warranty in Days"
              value={formik.values.warrantyInDays}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              name="coverage"
              formik={formik}
              label="Coverage"
              placeholder="Coverage"
              value={formik.values.coverage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div>
            <Input
              name="price"
              type="number"
              formik={formik}
              label="Price"
              placeholder="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Input
              name="category"
              formik={formik}
              label="Category"
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
              label="Quantity"
              placeholder="Quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
        <div>
          <label className="block text-sm mb-[1px]">Image</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (event.currentTarget.files && event.currentTarget.files[0]) {
                console.log("File selected:", event.currentTarget.files[0]);
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }
            }}
            className={`border text-xs p-[5px] text-gray-500 cursor-pointer hover:text-blue-500 hover:border-blue-500 ${
              formik.errors.image && formik.touched.image ? "border-red-500" : "border-gray-300"
            } rounded-sm w-full`}
          />
        </div>
        <div>
            <Input
              name="modelNo"
              formik={formik}
              label="Model No"
              placeholder="Model No"
              value={formik.values.modelNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div>
          <TextArea
            name="warrantyTermsAndConditions"
            formik={formik}
            label="Warranty Terms & Conditions"
            placeholder="Warranty Terms & Conditions"
            value={formik.values.warrantyTermsAndConditions}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        {preview && (
          <div className="mt-4">
            <p className="mb-2 text-gray-700">Image Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain border"
            />
          </div>
        )}
        <Button label="Update Product" type="submit" />
      </form>
    </div>
  );
};

export default EditProduct;
