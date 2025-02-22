import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
// import Cookies from "js-cookie";

interface ResourceHandler {
  method: "post" | "get" | "patch" | "delete";
  endpoint: string;
  data?: {};
  id?: string | number;
  isMultipart?: boolean;
  popupMessage?: boolean;
  popupText?: string;
}

export const handleResource = async ({
  method,
  endpoint,
  data,
  id,
  isMultipart,
  popupMessage,
  popupText,
}: ResourceHandler) => {
  const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || "authToken";
  const token = localStorage.getItem(TOKEN_NAME);

  try {
    if (method === "delete") {
      const confirmDelete = await Swal.fire({
        icon: "warning",
        title: "Confirmation",
        text: "Are You Sure To Delete ?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes !",
        cancelButtonText: "Cancel",
      });

      if (!confirmDelete.isConfirmed) {
        return;
      }
    }

    const baseURL = process.env.NEXT_PUBLIC_BASE_API;

    let url = baseURL + endpoint;

    if (id) {
      url += `/${id}`;
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.request({
      method,
      url,
      data: data,
      headers,
    });

    if (response && popupMessage) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: popupText,
        timer: 1500,
      });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : JSON.stringify(error.response?.data?.message);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage || "An unexpected error occurred.",
        timer: 3000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        timer: 3000,
      });
    }
  }
};
