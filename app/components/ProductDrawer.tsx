import React, { useEffect } from "react";
import { Drawer, Form, Input, Button, message } from "antd";
import { Product, createProduct, updateProduct } from "../utils/api";
import Swal from "sweetalert2";

interface ProductDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues: Product | null; // Data produk untuk mode edit
}

const ProductDrawer: React.FC<ProductDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm(); // Instance form dari Ant Design

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues); // Isi form dengan data produk yang diedit
    } else {
      form.resetFields(); // Reset form jika tidak ada data
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: Omit<Product, "id" | "createdAt">) => {
    try {
      if (initialValues) {
        await updateProduct(initialValues.id, values); // Perbarui produk
        message.success("Product updated successfully!");
      } else {
        await createProduct(values); // Tambah produk baru
        message.success("Product added successfully!");
      }
      Swal.fire({
        icon: "success",
        title: initialValues ? "Updated!" : "Added!",
        text: initialValues
          ? "Your product has been updated."
          : "Your product has been added.",
        confirmButtonText: "OK",
      });
      form.resetFields();
      onSuccess(); // Panggil callback sukses
    } catch (error) {
      message.error("Operation failed!");
      console.error(error);
    }
  };

  return (
    <Drawer
      title={initialValues ? "Edit Product" : "Add Product"}
      width={400}
      onClose={onClose}
      open={visible}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="image" label="Image URL">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialValues ? "Update" : "Add"}
        </Button>
      </Form>
    </Drawer>
  );
};

export default ProductDrawer;
