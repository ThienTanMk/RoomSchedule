import { chatbotApi } from '@/service/chatbot';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';

export const useChatbotHistory = (keycloakId?: string) => {
  return useQuery({
    queryKey: ['chatbot', 'history', keycloakId],
    queryFn: () => chatbotApi.getHistory(keycloakId!),
    enabled: !!keycloakId,
  });
};

export const useAskChatbot = () => {
  return useMutation({
    mutationFn: ({ message, keycloakId }: { message: string; keycloakId: string }) =>
      chatbotApi.ask(message, keycloakId),
  });
};

export const useClearChatHistory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keycloakId: string) => chatbotApi.clearHistory(keycloakId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chatbot', 'history'] }),
  });
};

export const useChatbotSSE = (keycloakId: string, onMessage: (data: string) => void) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!keycloakId) return;

    const es = new EventSource(`http://localhost:8080/ai-agent/sse/connect/${keycloakId}`);

    es.addEventListener('ai-message', (e: MessageEvent) => {
      onMessage(e.data);
    });

    es.onerror = (err) => {
      console.error('SSE Error:', err);
      es.close();
    };

    eventSourceRef.current = es;

    return () => {
      es.close();
    };
  }, [keycloakId, onMessage]);
};