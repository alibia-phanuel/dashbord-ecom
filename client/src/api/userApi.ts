import axiosInstance from "./axiosInstance";
import type { UsersResponse, UserResponse } from "@/types/Api";

// 🟢 Fetch all users
export const fetchUsers = async (): Promise<UsersResponse> => {
  try {
    const response = await axiosInstance.get("/users/getAllUsers");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch users.");
  }
};

// 🔵 Fetch user by UUID
export const fetchUserById = async (uuid: string): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.get(`/users/getUser/${uuid}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch user with UUID ${uuid}.`);
  }
};

// 🟡 Create a user
export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employe" | "client";
}): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.post("/users/create", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user.");
  }
};

// 🟠 Update a user
export const updateUser = async (
  uuid: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "employe" | "client";
    profilePicture?: string;
  }
): Promise<UserResponse> => {
  try {
    const response = await axiosInstance.patch(`/users/update/${uuid}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update user with UUID ${uuid}.`);
  }
};

// 🔴 Delete a user
export const deleteUser = async (uuid: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/delete/${uuid}`);
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete user with UUID ${uuid}.`);
  }
};
