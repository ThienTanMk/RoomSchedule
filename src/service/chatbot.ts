import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/model/api-response.model';
import { AiResponse } from '@/model/ai-response.model';

const API_URL = 'http://localhost:8080/ai-agent';

export const chatbotApi = {
  ask: async (message: string, keycloakId: string): Promise<string> => {
    const res = await apiClient.post<string>(
      `${API_URL}/conversation/ask?keycloakId=${keycloakId}`,
      { aiMessage: message },
      { responseType: 'text' }
    );
    return res.data;
  },

  getHistory: async (keycloakId: string): Promise<ApiResponse<AiResponse[]>> => {
    const res = await apiClient.get<ApiResponse<AiResponse[]>>(
      `${API_URL}/conversation/history?keycloakId=${keycloakId}`
    );
    return res.data;
  },

  clearHistory: async (keycloakId: string): Promise<ApiResponse<string>> => {
    const res = await apiClient.delete<ApiResponse<string>>(
      `${API_URL}/conversation/${keycloakId}`
    );
    return res.data;
  },
};
