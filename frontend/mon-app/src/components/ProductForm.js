import React, { useState, useEffect } from "react";
import api from "../api";

function ProductForm({ product, onProductCreated, onProductUpdated }) {
  const isEditing = Boolean(product);
  const [name, setName] = useState(product ? product.name : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price : 0);
  const [category, setCategory] = useState(product ? product.category : "");
  const [isFavorite, setIsFavorite] = useState(
    product ? product.is_favorite : false
  );
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setIsFavorite(product.is_favorite);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      price,
      category,
      is_favorite: isFavorite,
    };
    try {
      if (isEditing) {
        await api.put(`/products/${product.id}`, productData);
        if (onProductUpdated) onProductUpdated();
      } else {
        await api.post("/products/", productData);
        if (onProductCreated) onProductCreated();
        // Clear form after creation
        setName("");
        setDescription("");
        setPrice(0);
        setCategory("");
        setIsFavorite(false);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  return (
    <div className="w-full">
      {isEditing ? (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {showForm ? "Cancel" : "Edit"}
        </button>
      ) : (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-white p-4 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-indigo-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-indigo-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-indigo-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-indigo-300"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="text-gray-700 mr-2">Favorite:</label>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="h-4 w-4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md"
          >
            {isEditing ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ProductForm;
