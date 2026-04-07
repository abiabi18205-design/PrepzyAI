// lib/api.ts
import axios from "axios";
import { toast } from "react-hot-toast"; // Optional: for toast notifications

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Enable cookies for cross-origin requests
  timeout: 30000, // ✅ 30 second timeout
});

// ── Request Interceptor (Auto attach token) ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ── Response Interceptor (Handle errors globally) ─────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Token expired or invalid
      console.log("Authentication failed, redirecting to login...");
      
      // Clear stored token
      removeToken();
      
      // Clear user from localStorage if exists
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes("/login") && 
            !window.location.pathname.includes("/signup")) {
          window.location.href = "/login?session=expired";
        }
      }
      
      return Promise.reject(new Error("Session expired. Please login again."));
    }
    
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
      if (typeof window !== "undefined") {
        toast?.error("You don't have permission to perform this action");
      }
    }
    
    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
      if (typeof window !== "undefined") {
        toast?.error("Server error. Please try again later.");
      }
    }
    
    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      if (typeof window !== "undefined") {
        toast?.error("Request timeout. Please check your connection.");
      }
    }
    
    if (!error.response) {
      console.error("Network error:", error);
      if (typeof window !== "undefined") {
        toast?.error("Network error. Please check your internet connection.");
      }
    }
    
    return Promise.reject(error);
  }
);

// ── Auth API calls ────────────────────────────────────────────────────────────

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "user" | "admin";
    };
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "user" | "admin";
    };
  };
}
//Frontend connection with backend usig axios for logging in, registering, and other auth related functions. Also includes token management and error handling. 
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (error: any) {
    // Throw the error message from backend if available
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
  try {
    const res = await api.post("/api/auth/register", { name, email, password });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const token = getToken();
    if (token) {
      await api.post("/api/auth/logout");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear local storage even if API call fails
    removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }
}

export async function getCurrentUser() {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }
    
    const res = await api.get("/api/auth/me");
    if (res.data.success) {
      // Cache user data
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }
      return res.data.data.user;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const res = await api.post("/api/auth/reset-password", { token, newPassword });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function updateProfile(name: string) {
  try {
    const res = await api.put("/api/auth/profile", { name });
    if (res.data.success && typeof window !== "undefined") {
      // Update cached user data
      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        user.name = name;
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const res = await api.post("/api/auth/change-password", { currentPassword, newPassword });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// ── Delete Own Account (user deletes themselves) ──────────────────────────────

export async function deleteOwnAccount() {
  try {
    const res = await api.delete("/api/auth/delete-account");
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!getToken();
}

export function getUserFromCache() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
}

export function clearAuthCache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

// ── Question API calls ────────────────────────────────────────────────────────

export async function getQuestions(params?: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params?.search) queryParams.append("search", params.search);
    
    const url = `/api/questions${queryParams.toString() ? `?${queryParams}` : ""}`;
    const res = await api.get(url);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function getQuestionById(id: string) {
  try {
    const res = await api.get(`/api/questions/${id}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// ── Dashboard Stats API calls ─────────────────────────────────────────────────

export async function getDashboardStats() {
  try {
    const res = await api.get("/api/dashboard/stats");
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// ── Admin API calls ──────────────────────────────────────────────────────────

export async function getAdminUsers() {
  try {
    const res = await api.get("/api/auth/users");
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function deleteAdminUser(id: string) {
  try {
    const res = await api.delete(`/api/auth/users/${id}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function updateAdminUserRole(userId: string, role: "user" | "admin") {
  try {
    const res = await api.put("/api/auth/update-role", { userId, role });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function adminCreateQuestion(data: {
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  answer?: string;
  tags?: string[];
}) {
  try {
    const res = await api.post("/api/questions", data);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function adminUpdateQuestion(
  id: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    answer?: string;
    tags?: string[];
  }
) {
  try {
    const res = await api.put(`/api/questions/${id}`, data);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function adminDeleteQuestion(id: string) {
  try {
    const res = await api.delete(`/api/questions/${id}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

// ── Results API calls ─────────────────────────────────────────────────────────

export async function getResults(params?: {
  page?: number;
  limit?: number;
  timeRange?: string;
  minScore?: number;
  status?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.timeRange) queryParams.append("timeRange", params.timeRange);
    if (params?.minScore) queryParams.append("minScore", params.minScore.toString());
    if (params?.status) queryParams.append("status", params.status);
    
    const url = `/api/practice/results${queryParams.toString() ? `?${queryParams}` : ""}`;
    const res = await api.get(url);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export async function onboardingChat(messages: { role: string; content: string }[]) {
  try {
    const res = await api.post("/api/onboarding/chat", { messages });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function saveOnboardingPreferences(data: {
  role: string;
  level: string;
  type: string;
  plan: string;
}) {
  try {
    const res = await api.post("/api/onboarding/preferences", data);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

// ── Payment API calls ─────────────────────────────────────────────────────────

export async function createPaymentSession(plan: "pro" | "premium", billing: "monthly" | "yearly") {
  try {
    const res = await api.post("/api/payment/create-checkout-session", { plan, billing });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function getUserPlan() {
  try {
    const res = await api.get("/api/payment/plan");
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function activateFreePlan() {
  try {
    const res = await api.post("/api/payment/activate-free");
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export async function confirmPaymentSession(sessionId?: string | null, mock?: string | null, plan?: string) {
  try {
    const res = await api.post("/api/payment/confirm-session", { sessionId, mock, plan });
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
}

export default api;