
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseMembers } from '@/hooks/useSupabaseMembers';
import { RefreshCw, Database, CheckCircle, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';

const GoogleSheetsSync = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const { members, loading, fetchMembers, error } = useSupabaseMembers();
  const { toast } = useToast();

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      // Testar conexão básica com Supabase
      const response = await fetch(`https://hwstbxvalwbrqarbdzep.supabase.co/rest/v1/`);
      
      if (!response.ok) {
        setConnectionStatus('disconnected');
        console.warn('Supabase não está acessível:', response.status);
      } else {
        setConnectionStatus('connected');
      }
    } catch (err) {
      setConnectionStatus('disconnected');
      console.warn('Erro ao verificar conexão:', err);
    }
  };

  const fetchSyncLogs = async () => {
    try {
      console.log('Logs de sincronização não disponíveis ainda - aguardando criação das tabelas');
      setSyncLogs([]);
    } catch (err) {
      console.warn('Erro ao carregar logs:', err);
      setSyncLogs([]);
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira a URL do webhook do n8n",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "Teste de conexão do sistema da igreja"
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        toast({
          title: "Teste realizado com sucesso",
          description: "O webhook está funcionando corretamente"
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      toast({
        title: "Erro no teste",
        description: "Não foi possível conectar com o webhook",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const manualSync = async () => {
    setIsLoading(true);
    try {
      await fetchMembers();
      await fetchSyncLogs();
      toast({
        title: "Sincronização concluída",
        description: "Dados atualizados com sucesso"
      });
    } catch (err) {
      toast({
        title: "Erro na sincronização",
        description: "Falha ao sincronizar dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Erro</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Processando</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  useEffect(() => {
    checkConnection();
    fetchSyncLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Status da Conexão com Banco de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {connectionStatus === 'connected' ? (
                <div className="text-green-600">
                  <p className="font-medium">✓ Conectado</p>
                  <p className="text-sm text-muted-foreground">Supabase está acessível</p>
                </div>
              ) : connectionStatus === 'disconnected' ? (
                <div className="text-red-600">
                  <p className="font-medium">✗ Desconectado</p>
                  <p className="text-sm text-muted-foreground">
                    {error || 'As tabelas do banco ainda não foram criadas'}
                  </p>
                </div>
              ) : (
                <div className="text-yellow-600">
                  <p className="font-medium">⟳ Verificando...</p>
                  <p className="text-sm text-muted-foreground">Testando conexão</p>
                </div>
              )}
            </div>
            <Button onClick={checkConnection} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status da Integração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Status da Sincronização com Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-sm text-blue-800">Membros Carregados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{syncLogs.filter(log => log.status === 'success').length}</div>
              <div className="text-sm text-green-800">Sincronizações com Sucesso</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{syncLogs.filter(log => log.status === 'error').length}</div>
              <div className="text-sm text-red-800">Erros de Sincronização</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Webhook n8n</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://seu-n8n.com/webhook/igreja-membros"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={testWebhook} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              Testar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Configure seu workflow n8n para enviar dados para este sistema quando houver mudanças na planilha.
          </div>
        </CardContent>
      </Card>

      {/* Ações de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={manualSync} 
              disabled={isLoading || loading}
              className="church-gradient text-white"
            >
              {isLoading || loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sincronizar Agora
            </Button>
            <Button 
              onClick={fetchSyncLogs} 
              variant="outline"
            >
              Atualizar Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Sincronizações</CardTitle>
        </CardHeader>
        <CardContent>
          {syncLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum log de sincronização encontrado</p>
              <p className="text-sm">Os logs aparecerão aqui quando houver sincronizações</p>
            </div>
          ) : (
            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(log.status)}
                      <span className="text-sm font-medium">{log.action}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(log.created_at)}
                    </div>
                    {log.error_message && (
                      <div className="text-sm text-red-600 mt-1">
                        {log.error_message}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleSheetsSync;
