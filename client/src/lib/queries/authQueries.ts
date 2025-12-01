import { API_ENDPOINTS } from "../constants";
import { tokenStorage } from "../storage";
import api from "../api";

export const authQueries = {
  checkAuth: async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      throw new Error("No acces token");
    }

    const response = await api.get(API_ENDPOINTS.PROTECTED);
    return response.data;
  },
};
