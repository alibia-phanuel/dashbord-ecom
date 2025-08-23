import axiosInstance from "./axiosInstance";
import type { ProductImagesResponse } from "@/types/Api";

// 🟢 Upload images for a product
export const uploadImages = async (
  productId: number,
  images: File[]
): Promise<void> => {
  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    await axiosInstance.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
      console.log(error);
    throw new Error(`Failed to upload images for product ID ${productId}.`);
  }
};

// 🔵 Fetch images for a product
export const getImages = async (
  productId: number
): Promise<ProductImagesResponse> => {
  try {
    const response = await axiosInstance.get(`/products/${productId}/images`);
    return response.data;
  } catch (error) {
      console.log(error);
    throw new Error(`Failed to fetch images for product ID ${productId}.`);
  }
};

// 🔴 Delete an image
export const deleteImage = async (
  productId: number,
  imgId: number
): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/${productId}/images/${imgId}`);
  } catch (error) {
      console.log(error);
    throw new Error(
      `Failed to delete image ID ${imgId} for product ID ${productId}.`
    );
  }
};
