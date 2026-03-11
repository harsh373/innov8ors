import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const getClerkToken = async (): Promise<string | null> => {
  const clerk = (window as any).Clerk;

  if (!clerk) return null;

  if (clerk.session) {
    return await clerk.session.getToken();
  }

  return new Promise((resolve) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const session = (window as any).Clerk?.session;
      if (session) {
        clearInterval(interval);
        const token = await session.getToken();
        resolve(token);
      } else if (attempts >= 10) {
        clearInterval(interval);
        resolve(null);
      }
    }, 200);
  });
};

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error("No Clerk token — user not signed in or Clerk not ready");
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;