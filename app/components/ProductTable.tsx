"use client";
import { Table, Button, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAllProducts, deleteProduct, Product } from "../utils/api";
import ProductDrawer from "./ProductDrawer";

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const MySwal = withReactContent(Swal);

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      const startIndex = (page - 1) * 10;
      const paginatedData = data.slice(startIndex, startIndex + 10);

      // Jika halaman kosong dan bukan halaman pertama, kembali ke halaman sebelumnya
      if (paginatedData.length === 0 && page > 1) {
        setCurrentPage(page - 1);
      } else {
        setProducts(paginatedData);
        setTotal(data.length);
      }
    } catch (error) {
      message.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully!");
      fetchProducts(currentPage); // Refresh data
    } catch (error) {
      message.error("Failed to delete product");
      console.error(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDrawerVisible(true);
  };

  const confirmDelete = (id: string) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33333",
      confirmButtonText: "Yes, delete it!",
    }).then((result: SweetAlertResult) => {
      Swal.fire({
        title: "Product has been deleted!",
        icon: "success",
      });
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => setDrawerVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Add New Product
      </Button>
      <Table<Product>
        dataSource={products}
        loading={loading}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="id"
        columns={[
          { title: "Id", dataIndex: "id", key: "id" },
          { title: "Title", dataIndex: "title", key: "title" },
          { title: "Price", dataIndex: "price", key: "price" },
          { title: "Category", dataIndex: "category", key: "category" },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <Space size="middle">
                <Button onClick={() => handleEdit(record)}>Edit</Button>
                <Button onClick={() => confirmDelete(record.id!)} danger>
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <ProductDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        initialValues={editingProduct} // Kirim data produk yang akan diedit
        onSuccess={() => {
          setDrawerVisible(false);
          fetchProducts(currentPage); // Refresh data setelah edit
        }}
      />
    </>
  );
};

export default ProductTable;
