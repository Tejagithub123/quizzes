import React, { useEffect, useState } from "react";
import api from "../api";
import ProductList from "./ProductList";

function FavoriteList() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/products/");
      const favProducts = response.data.filter((prod) => prod.is_favorite);
      setFavorites(favProducts);
    } catch (err) {
      console.error("Error fetching favorites", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Favorite Products
        </h2>
        <ProductList
          products={favorites}
          onProductUpdated={fetchFavorites}
          onProductDeleted={fetchFavorites}
        />
      </div>
    </div>
  );
}

export default FavoriteList;
