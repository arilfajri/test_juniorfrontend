"use client";
import { Table, Button, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getAllProducts, deleteProduct, Product } from "../utils/api";

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const MySwal = withReactContent(Swal);

  const fetchProducts = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data.slice((page - 1) * 10, page * 10)); // Pagination manual
      setTotal(data.length);
    } catch (error) {
      message.error("Failed to load products");
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
    }
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
    }).then((result: any) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
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
        { title: "Description", dataIndex: "description", key: "description" },
        {
          title: "Actions",
          key: "actions",
          render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => console.log("Edit", record)}>Edit</Button>
              <Button onClick={() => confirmDelete(record.id!)} danger>
                Delete
              </Button>
            </Space>
          ),
        },
      ]}
    />
  );
};

export default ProductTable;
