import axios from "axios";
import useUserStore from "../store/useUserStore";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        // Handle unauthorized access (401)
        console.log("Unauthorized access - Token might be expired.");
        originalRequest._retry = true;

        // Here you would typically refresh the token
        // const refreshTokenSuccess = await refreshToken();

        // if (refreshTokenSuccess) {
        //     originalRequest.headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
        //     return axios(originalRequest);
        // }

        useUserStore.getState().clearUser();
      } else if (error.response.status === 403) {
        console.log(
          "Forbidden access - You do not have permission to access this resource."
        );
        useUserStore.getState().clearUser();
      }
    }

    return Promise.reject(error);
  }
);
// Helper: Get Authorization Header
// function getAuthHeader() {
//     const token = localStorage.getItem('token');
//     return token ? { Authorization: `Bearer ${token}` } : {};
// }

function getAuthHeader() {
  const token = useUserStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper: Refresh Token
async function refreshToken() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("refreshToken") }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    } else {
      console.error("Token refresh failed");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

// API Request Function
// API Request Function using Axios
async function apiRequest(
  method,
  url,
  body = null,
  type = "json",
  baseUrl = import.meta.env.VITE_BASE_URL + "/api"
) {
  try {
    const headers = {
      "Content-Type":
        type === "json" ? "application/json" : "multipart/form-data",
      ...getAuthHeader(),
    };

    const options = {
      method,
      url: baseUrl + url,
      headers,
      data: body ? (type === "json" ? body : body) : undefined,
    };

    const response = await axios(options);

    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Request failed:", error);
    return error?.response?.data; // Rethrow the error to handle it in the calling function
  }
}
export async function downloadRequest(
  url,
  filename = "download",
  baseUrl = import.meta.env.VITE_BASE_URL + "/api"
) {
  try {
    const options = {
      method: "GET",
      url: baseUrl + url,
      headers: {
        ...getAuthHeader(),
      },
      responseType: "blob", // This is crucial for file downloads
    };

    const response = await axios(options);

    // Create blob from response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers["content-disposition"];
    let finalFilename = filename;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch && filenameMatch[1]) {
        finalFilename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    link.download = finalFilename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return {
      code: 200,
      message: "Download completed successfully",
      info: { filename: finalFilename },
    };
  } catch (error) {
    console.error("Download failed:", error);

    return {
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Download failed",
      info: error.response?.data || null,
    };
  }
}
export function getRequest(url) {
  return apiRequest("GET", url);
}

export function postRequest(url, body, type = "json") {
  return apiRequest("POST", url, body, type);
}

export function putRequest(url, body, type = "json") {
  return apiRequest("PUT", url, body, type);
}

function patchRequest(url, body, type = "json") {
  return apiRequest("PATCH", url, body, type);
}

export function deleteRequest(url, body, type = "json") {
  return apiRequest("DELETE", url, body, type);
}


