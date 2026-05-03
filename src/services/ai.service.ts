import axiosInstance from "@/lib/axios";

const getSearchSuggestions = async (query: string) => {
  const res = await axiosInstance.get(`/ai/search-suggestions?q=${encodeURIComponent(query)}`);
  return res.data;
};

const getTrendingIdeas = async () => {
  const res = await axiosInstance.get("/ai/trending");
  return res.data;
};

const chat = async (message: string) => {
  const res = await axiosInstance.post("/ai/chat", { message });
  return res.data;
};

export const aiService = {
  getSearchSuggestions,
  getTrendingIdeas,
  chat,
};
