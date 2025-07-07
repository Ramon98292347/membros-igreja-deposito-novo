
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemberContext } from '@/context/MemberContext';
import { useChurchContext } from '@/context/ChurchContext';
import { useInventoryContext } from '@/context/InventoryContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Users, Building, Package } from 'lucide-react';

const Reports = () => {
  const { members } = useMemberContext();
  const { churches } = useChurchContext();
  const { items } = useInventoryContext();
  
  const [reportType, setReportType] = useState('membros');
  const [specificReport, setSpecificReport] = useState('todos');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const reportTypes = [
    { value: 'membros', label: 'Relatórios de Membros', icon: Users },
    { value: 'igrejas', label: 'Relatórios de Igrejas', icon: Building },
    { value: 'deposito', label: 'Relatórios de Depósito', icon: Package }
  ];

  const memberReports = [
    { value: 'todos', label: 'Todos os Membros' },
    { value: 'por-funcao', label: 'Membros por Função' },
    { value: 'aniversariantes', label: 'Aniversariantes do Mês' },
    { value: 'por-estado-civil', label: 'Por Estado Civil' },
    { value: 'batizados-periodo', label: 'Batizados em Período' }
  ];

  const churchReports = [
    { value: 'todas', label: 'Todas as Igrejas' },
    { value: 'por-classificacao', label: 'Por Classificação' },
    { value: 'por-estado', label: 'Por Estado' },
    { value: 'estatisticas', label: 'Estatísticas de Membros' }
  ];

  const inventoryReports = [
    { value: 'todos-itens', label: 'Todos os Itens' },
    { value: 'estoque-baixo', label: 'Estoque Baixo' },
    { value: 'por-tipo', label: 'Por Tipo de Mercadoria' },
    { value: 'valor-estoque', label: 'Valor do Estoque' }
  ];

  const getSpecificReports = () => {
    switch (reportType) {
      case 'membros': return memberReports;
      case 'igrejas': return churchReports;
      case 'deposito': return inventoryReports;
      default: return [];
    }
  };

  const generateReport = () => {
    let reportData: any = null;

    if (reportType === 'membros') {
      switch (specificReport) {
        case 'todos':
          reportData = {
            type: 'table',
            title: 'Relatório - Todos os Membros',
            data: members,
            columns: ['nomeCompleto', 'funcaoMinisterial', 'telefone', 'cidade', 'estado']
          };
          break;
        case 'por-funcao':
          const byFunction = members.reduce((acc, member) => {
            acc[member.funcaoMinisterial] = (acc[member.funcaoMinisterial] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          reportData = {
            type: 'chart',
            title: 'Membros por Função Ministerial',
            chartData: Object.entries(byFunction).map(([funcao, count]) => ({ funcao, quantidade: count })),
            tableData: Object.entries(byFunction).map(([funcao, count]) => ({ funcao, quantidade: count }))
          };
          break;
        case 'aniversariantes':
          const currentMonth = new Date().getMonth() + 1;
          const aniversariantes = members.filter(member => {
            const birthMonth = new Date(member.dataNascimento).getMonth() + 1;
            return birthMonth === currentMonth;
          });
          
          reportData = {
            type: 'table',
            title: `Aniversariantes do Mês (${new Date().toLocaleDateString('pt-BR', { month: 'long' })})`,
            data: aniversariantes,
            columns: ['nomeCompleto', 'dataNascimento', 'telefone', 'funcaoMinisterial']
          };
          break;
      }
    } else if (reportType === 'igrejas') {
      switch (specificReport) {
        case 'todas':
          reportData = {
            type: 'table',
            title: 'Relatório - Todas as Igrejas',
            data: churches,
            columns: ['nomeIPDA', 'classificacao', 'tipoIPDA', 'membrosAtuais', 'almasBatizadas']
          };
          break;
        case 'por-classificacao':
          const byClassification = churches.reduce((acc, church) => {
            acc[church.classificacao] = (acc[church.classificacao] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          reportData = {
            type: 'chart',
            title: 'Igrejas por Classificação',
            chartData: Object.entries(byClassification).map(([classificacao, count]) => ({ classificacao, quantidade: count })),
            tableData: Object.entries(byClassification).map(([classificacao, count]) => ({ classificacao, quantidade: count }))
          };
          break;
      }
    } else if (reportType === 'deposito') {
      switch (specificReport) {
        case 'todos-itens':
          reportData = {
            type: 'table',
            title: 'Relatório - Todos os Itens do Depósito',
            data: items,
            columns: ['nomeItem', 'tipoMercadoria', 'quantidadeEstoque', 'valorUnitario', 'estoqueMinimo']
          };
          break;
        case 'estoque-baixo':
          const lowStock = items.filter(item => item.quantidadeEstoque <= (item.estoqueMinimo || 10));
          
          reportData = {
            type: 'table',
            title: 'Relatório - Itens com Estoque Baixo',
            data: lowStock,
            columns: ['nomeItem', 'quantidadeEstoque', 'estoqueMinimo', 'valorUnitario']
          };
          break;
        case 'por-tipo':
          const byType = items.reduce((acc, item) => {
            acc[item.tipoMercadoria] = (acc[item.tipoMercadoria] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          reportData = {
            type: 'chart',
            title: 'Itens por Tipo de Mercadoria',
            chartData: Object.entries(byType).map(([tipo, count]) => ({ tipo, quantidade: count })),
            tableData: Object.entries(byType).map(([tipo, count]) => ({ tipo, quantidade: count }))
          };
          break;
      }
    }

    setGeneratedReport(reportData);
  };

  const exportReport = () => {
    if (!generatedReport) return;

    let csvContent = '';
    
    if (generatedReport.type === 'table') {
      const headers = generatedReport.columns.map((col: string) => {
        const headerMap: Record<string, string> = {
          'nomeCompleto': 'Nome Completo',
          'funcaoMinisterial': 'Função Ministerial',
          'telefone': 'Telefone',
          'cidade': 'Cidade',
          'estado': 'Estado',
          'dataNascimento': 'Data de Nascimento',
          'nomeIPDA': 'Nome da Igreja',
          'classificacao': 'Classificação',
          'tipoIPDA': 'Tipo IPDA',
          'membrosAtuais': 'Membros Atuais',
          'almasBatizadas': 'Almas Batizadas',
          'nomeItem': 'Nome do Item',
          'tipoMercadoria': 'Tipo',
          'quantidadeEstoque': 'Quantidade',
          'valorUnitario': 'Valor Unitário',
          'estoqueMinimo': 'Estoque Mínimo'
        };
        return headerMap[col] || col;
      });
      csvContent += headers.join(',') + '\n';
      
      generatedReport.data.forEach((item: any) => {
        const row = generatedReport.columns.map((col: string) => {
          let value = item[col] || '';
          if (col.includes('data') && value) {
            value = new Date(value).toLocaleDateString('pt-BR');
          }
          return `"${value}"`;
        });
        csvContent += row.join(',') + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${reportType}_${specificReport}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#22c55e', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Relatórios do Sistema</h1>
        <p className="text-muted-foreground">
          Gere relatórios detalhados sobre membros, igrejas e depósito
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{members.length}</p>
                <p className="text-sm text-muted-foreground">Membros Cadastrados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{churches.length}</p>
                <p className="text-sm text-muted-foreground">Igrejas Cadastradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="text-sm text-muted-foreground">Itens no Depósito</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="specificReport">Relatório Específico</Label>
              <Select value={specificReport} onValueChange={setSpecificReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getSpecificReports().map(report => (
                    <SelectItem key={report.value} value={report.value}>
                      {report.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={generateReport} className="church-gradient text-white w-full">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Relatório */}
      {generatedReport && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{generatedReport.title}</CardTitle>
              <Button onClick={exportReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {generatedReport.type === 'chart' && (
              <div className="space-y-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generatedReport.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={Object.keys(generatedReport.chartData[0])[0]} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantidade" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generatedReport.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="quantidade"
                      >
                        {generatedReport.chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {generatedReport.type === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {generatedReport.columns.map((col: string) => {
                        const headerMap: Record<string, string> = {
                          'nomeCompleto': 'Nome Completo',
                          'funcaoMinisterial': 'Função Ministerial',
                          'telefone': 'Telefone',
                          'cidade': 'Cidade',
                          'estado': 'Estado',
                          'dataNascimento': 'Data de Nascimento',
                          'nomeIPDA': 'Nome da Igreja',
                          'classificacao': 'Classificação',
                          'tipoIPDA': 'Tipo IPDA',
                          'membrosAtuais': 'Membros Atuais',
                          'almasBatizadas': 'Almas Batizadas',
                          'nomeItem': 'Nome do Item',
                          'tipoMercadoria': 'Tipo',
                          'quantidadeEstoque': 'Quantidade',
                          'valorUnitario': 'Valor Unitário',
                          'estoqueMinimo': 'Estoque Mínimo'
                        };
                        return (
                          <TableHead key={col}>
                            {headerMap[col] || col}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedReport.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={generatedReport.columns.length} className="text-center py-8 text-muted-foreground">
                          Nenhum dado encontrado para os filtros selecionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      generatedReport.data.map((item: any, index: number) => (
                        <TableRow key={index}>
                          {generatedReport.columns.map((col: string) => (
                            <TableCell key={col}>
                              {col.includes('data') && item[col] ? (
                                new Date(item[col]).toLocaleDateString('pt-BR')
                              ) : col === 'valorUnitario' ? (
                                `R$ ${parseFloat(item[col] || 0).toFixed(2)}`
                              ) : (
                                item[col] || '-'
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
