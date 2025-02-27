import React, { useEffect, useState } from "react";
import api from "../api";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/", {
        params: {
          skip: page * limit,
          limit: limit,
          search,
          category,
          sort,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, sort, page]);

  const handleProductCreated = () => {
    fetchProducts();
  };

  const handleProductUpdated = () => {
    fetchProducts();
  };

  const handleProductDeleted = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring focus:border-blue-300"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Sportswear">Sportswear</option>
                <option value="Accessories">Accessories</option>
                <option value="Home Decor">Home Decor</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Sort by Price</option>
                <option value="price_asc">Ascending</option>
                <option value="price_desc">Descending</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(page > 0 ? page - 1 : 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Previous
              </button>
              <span className="mx-2">Page {page + 1}</span>
              <button
                onClick={() => setPage(page + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <ProductForm onProductCreated={handleProductCreated} />
          </div>
          <div className="md:w-1/2">
            <ProductList
              products={products}
              onProductUpdated={handleProductUpdated}
              onProductDeleted={handleProductDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
