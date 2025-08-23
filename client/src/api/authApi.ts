import axiosInstance from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  CurrentUserResponse,
} from "../types/Api";

// 🟢 Authenticate a user
export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data; // ✅ ici tu retournes déjà les "data"
  } catch (error) {
    console.log(error);
    throw new Error("Failed to login user.");
  }
};

// 🔵 Get current authenticated user
export const getCurrentUser = async (
  token: string
): Promise<CurrentUserResponse> => {
  try {
    const response = await axiosInstance.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch current user.");
  }
};

// 🟡 Logout user
export const logoutUser = async (token: string): Promise<void> => {
  try {
    await axiosInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to logout user.");
  }
};
