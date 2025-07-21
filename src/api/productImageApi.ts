// src/api/productImageApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export const uploadImages = (productId: number, images: File[]) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });

  return axios.post(`${BASE_URL}/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getImages = (productId: number) =>
  axios.get(`${BASE_URL}/${productId}/images`);

export const deleteImage = (productId: number, imgId: number) =>
  axios.delete(`${BASE_URL}/${productId}/images/${imgId}`);
