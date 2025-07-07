
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useMemberContext } from '@/context/MemberContext';
import { useChurchContext } from '@/context/ChurchContext';
import { useInventoryContext } from '@/context/InventoryContext';
import { toast } from '@/hooks/use-toast';
import { Save, Settings as SettingsIcon, Palette, Layout, Menu, FileText, Moon, Sun } from 'lucide-react';

interface SystemSettings {
  theme: 'light' | 'dark' | 'system';
  cardStyle: 'default' | 'modern' | 'compact';
  formLayout: 'single-column' | 'two-column' | 'auto';
  menuPosition: 'left' | 'top' | 'bottom';
  primaryColor: string;
  showAvatars: boolean;
  compactMode: boolean;
  showStatistics: boolean;
}

const Settings = () => {
  const { members, config, updateConfig } = useMemberContext();
  const { churches } = useChurchContext();
  const { items } = useInventoryContext();

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    theme: 'light',
    cardStyle: 'default',
    formLayout: 'two-column',
    menuPosition: 'left',
    primaryColor: '#22c55e',
    showAvatars: true,
    compactMode: false,
    showStatistics: true
  });

  const [churchConfig, setChurchConfig] = useState(config);

  useEffect(() => {
    const savedSettings = localStorage.getItem('system-settings');
    if (savedSettings) {
      setSystemSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSystemSettingsChange = (key: keyof SystemSettings, value: any) => {
    const newSettings = { ...systemSettings, [key]: value };
    setSystemSettings(newSettings);
    localStorage.setItem('system-settings', JSON.stringify(newSettings));
    
    // Aplicar mudanças de tema imediatamente
    if (key === 'theme') {
      applyTheme(value);
    }
    
    toast({
      title: "Configuração atualizada",
      description: "As alterações foram aplicadas com sucesso."
    });
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Sistema
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleChurchConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!churchConfig.nomeIgreja.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome da igreja é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    try {
      updateConfig(churchConfig);
      toast({
        title: "Configurações salvas",
        description: "As configurações da igreja foram atualizadas."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    }
  };

  const resetAllSettings = () => {
    if (window.confirm('Deseja restaurar todas as configurações para o padrão? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('system-settings');
      setSystemSettings({
        theme: 'light',
        cardStyle: 'default',
        formLayout: 'two-column',
        menuPosition: 'left',
        primaryColor: '#22c55e',
        showAvatars: true,
        compactMode: false,
        showStatistics: true
      });
      applyTheme('light');
      
      toast({
        title: "Configurações restauradas",
        description: "Todas as configurações foram restauradas para o padrão."
      });
    }
  };

  const exportSystemData = () => {
    const dataToExport = {
      membros: members,
      igrejas: churches,
      deposito: items,
      configuracoes: { igreja: config, sistema: systemSettings },
      dataExportacao: new Date().toISOString(),
      versao: '2.0'
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `backup_sistema_completo_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Backup criado",
      description: "Todos os dados do sistema foram exportados."
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Configurações do Sistema</h1>
        <p className="text-muted-foreground">
          Personalize a aparência e comportamento do sistema
        </p>
      </div>

      {/* Estatísticas do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{members.length}</p>
              <p className="text-sm text-muted-foreground">Membros</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{churches.length}</p>
              <p className="text-sm text-muted-foreground">Igrejas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{items.length}</p>
              <p className="text-sm text-muted-foreground">Itens Depósito</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">v2.0</p>
              <p className="text-sm text-muted-foreground">Versão</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Aparência do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tema do Sistema</Label>
              <Select 
                value={systemSettings.theme} 
                onValueChange={(value) => handleSystemSettingsChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>Claro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Escuro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estilo dos Cards</Label>
              <Select 
                value={systemSettings.cardStyle} 
                onValueChange={(value) => handleSystemSettingsChange('cardStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="modern">Moderno</SelectItem>
                  <SelectItem value="compact">Compacto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Layout dos Formulários</Label>
              <Select 
                value={systemSettings.formLayout} 
                onValueChange={(value) => handleSystemSettingsChange('formLayout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-column">Uma Coluna</SelectItem>
                  <SelectItem value="two-column">Duas Colunas</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Posição do Menu</Label>
              <Select 
                value={systemSettings.menuPosition} 
                onValueChange={(value) => handleSystemSettingsChange('menuPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="top">Superior</SelectItem>
                  <SelectItem value="bottom">Inferior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Exibir Avatars</Label>
                <p className="text-sm text-muted-foreground">Mostra fotos de perfil nos cards</p>
              </div>
              <Switch
                checked={systemSettings.showAvatars}
                onCheckedChange={(checked) => handleSystemSettingsChange('showAvatars', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Modo Compacto</Label>
                <p className="text-sm text-muted-foreground">Interface mais densa</p>
              </div>
              <Switch
                checked={systemSettings.compactMode}
                onCheckedChange={(checked) => handleSystemSettingsChange('compactMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Exibir Estatísticas</Label>
                <p className="text-sm text-muted-foreground">Mostra números nos dashboards</p>
              </div>
              <Switch
                checked={systemSettings.showStatistics}
                onCheckedChange={(checked) => handleSystemSettingsChange('showStatistics', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Configurações da Igreja */}
      <form onSubmit={handleChurchConfigSave}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Informações da Igreja</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nomeIgreja">Nome da Igreja *</Label>
                <Input
                  id="nomeIgreja"
                  value={churchConfig.nomeIgreja}
                  onChange={(e) => setChurchConfig(prev => ({ ...prev, nomeIgreja: e.target.value }))}
                  placeholder="Igreja Pentecostal Deus é Amor"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={churchConfig.endereco}
                  onChange={(e) => setChurchConfig(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Av Santo Antonio N° 366, Caratoira, Vitória ES"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={churchConfig.telefone}
                  onChange={(e) => setChurchConfig(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(27) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={churchConfig.email}
                  onChange={(e) => setChurchConfig(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@ipdavitoria.com.br"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="church-gradient text-white">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações da Igreja
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Separator />

      {/* Backup e Restauração */}
      <Card>
        <CardHeader>
          <CardTitle>Backup e Restauração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={exportSystemData} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Exportar Backup Completo
            </Button>

            <Button onClick={resetAllSettings} variant="outline">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Restaurar Configurações Padrão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
