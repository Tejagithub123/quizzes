import React from "react";
import api from "../api";
import ProductForm from "./ProductForm";

function ProductList({ products, onProductUpdated, onProductDeleted }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      onProductDeleted();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const toggleFavorite = async (product) => {
    try {
      const updatedProduct = { ...product, is_favorite: !product.is_favorite };
      await api.put(`/products/${product.id}`, updatedProduct);
      onProductUpdated();
    } catch (err) {
      console.error("Error updating favorite", err);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Product List</h3>
      {products.length === 0 && <p>No products found</p>}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/80"
                alt="Product"
                className="w-20 h-20 rounded"
              />
              <div>
                <h4 className="text-xl font-bold">{product.name}</h4>
                <p className="text-gray-600">
                  ${product.price} - {product.category}
                </p>
                <p className="text-gray-500 text-sm">{product.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => toggleFavorite(product)}
                className={`px-3 py-1 rounded-md ${
                  product.is_favorite ? "bg-yellow-400" : "bg-gray-300"
                } text-white`}
              >
                {product.is_favorite ? "Unfavorite" : "Favorite"}
              </button>
              <ProductForm
                product={product}
                onProductUpdated={onProductUpdated}
              />
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
