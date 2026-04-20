import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListOpenaiMessagesQueryKey } from '@workspace/api-client-react';

export function useSSEChat(conversationId: number | undefined) {
  const [isTyping, setIsTyping] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const queryClient = useQueryClient();

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;
    
    setIsTyping(true);
    setStreamedResponse('');

    try {
      const response = await fetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                break;
              }
              if (data.content) {
                setStreamedResponse((prev) => prev + data.content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
      // Invalidate messages query to refetch full history
      queryClient.invalidateQueries({ queryKey: getListOpenaiMessagesQueryKey(conversationId) });
    }
  }, [conversationId, queryClient]);

  return { sendMessage, isTyping, streamedResponse };
}
