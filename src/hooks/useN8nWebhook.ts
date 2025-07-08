
import { useState } from 'react';

interface WebhookData {
  action: 'create' | 'update' | 'delete';
  type: 'member' | 'church' | 'inventory';
  data: any;
  timestamp: string;
  userId?: string;
}

export const useN8nWebhook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const webhookUrl = 'https://webhookn8n.rfautomatic.click/webhook/secretaria-igreja-membros';

  const sendToWebhook = async (webhookData: WebhookData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando dados para n8n webhook:', webhookData);
      
      const payload = {
        ...webhookData,
        timestamp: new Date().toISOString(),
        source: 'secretaria-igreja-sistema',
        version: '2.0'
      };
      
      console.log('Payload sendo enviado:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta do webhook:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.text();
      console.log('Resposta do webhook:', responseData);

      console.log('Dados enviados para webhook n8n com sucesso');
      return { success: true };
    } catch (err) {
      console.error('Erro ao enviar para webhook n8n:', err);
      setError('Erro ao enviar dados para o webhook');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMemberData = async (action: 'create' | 'update' | 'delete', memberData: any) => {
    return sendToWebhook({
      action,
      type: 'member',
      data: memberData,
      timestamp: new Date().toISOString()
    });
  };

  const sendChurchData = async (action: 'create' | 'update' | 'delete', churchData: any) => {
    return sendToWebhook({
      action,
      type: 'church',
      data: churchData,
      timestamp: new Date().toISOString()
    });
  };

  const sendInventoryData = async (action: 'create' | 'update' | 'delete', inventoryData: any) => {
    return sendToWebhook({
      action,
      type: 'inventory',
      data: inventoryData,
      timestamp: new Date().toISOString()
    });
  };

  return {
    sendMemberData,
    sendChurchData,
    sendInventoryData,
    loading,
    error
  };
};
