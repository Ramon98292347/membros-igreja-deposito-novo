
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useIgrejaContext } from '@/context/IgrejaContext';
import { useOptimizedDashboard } from '@/hooks/useOptimizedDashboard';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Plus, File, Edit, Trash2, Building, Package, TrendingUp } from 'lucide-react';
import { Member } from '@/types/member';

const Dashboard = () => {
  const { members, searchMembers, deleteMember } = useMemberContext();
  const { getIgrejaStats } = useIgrejaContext();
  const { memberStats, inventoryStats } = useOptimizedDashboard();
  
  // Obter estatísticas das igrejas diretamente do contexto
  const churchStats = getIgrejaStats();
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredMembers = useMemo(() => {
    return searchMembers(debouncedSearchQuery);
  }, [debouncedSearchQuery, members, searchMembers]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o membro ${name}?`)) {
      deleteMember(id);
    }
  };

  const getFunctionBadgeColor = (funcao: string) => {
    const colors: Record<string, string> = {
      'Pastor': 'bg-purple-100 text-purple-800',
      'Presbítero': 'bg-blue-100 text-blue-800',
      'Diácono': 'bg-green-100 text-green-800',
      'Obreiro': 'bg-yellow-100 text-yellow-800',
      'Membro': 'bg-gray-100 text-gray-800',
      'Missionário': 'bg-red-100 text-red-800',
      'Evangelista': 'bg-orange-100 text-orange-800'
    };
    return colors[funcao] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos membros da igreja e do depósito
          </p>
        </div>
        <Link to="/membros/novo">
          <Button className="church-gradient text-white shadow-church">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Novo Membro
          </Button>
        </Link>
      </div>

      {/* Cards de Resumo dos Membros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="church-gradient text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.total}</div>
            <p className="text-xs text-white/80">
              membros cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pastores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {memberStats.byFunction['Pastor'] || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obreiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {memberStats.byFunction['Obreiro'] || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presbíteros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {memberStats.byFunction['Presbítero'] || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Novos Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {memberStats.byFunction['Membro'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              membros ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diáconos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {memberStats.byFunction['Diácono'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              diáconos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evangelistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {memberStats.byFunction['Evangelista'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              evangelistas ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas das Igrejas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Estatísticas das Igrejas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{churchStats.total}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{churchStats.byClassification['estadual'] || 0}</div>
              <div className="text-sm text-purple-800">Estadual</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{churchStats.byClassification['setorial'] || 0}</div>
              <div className="text-sm text-green-800">Setorial</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-pink-600">{churchStats.byClassification['central'] || 0}</div>
              <div className="text-sm text-pink-800">Central</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{churchStats.byClassification['regional'] || 0}</div>
              <div className="text-sm text-orange-800">Regional</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Building className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <div className="text-2xl font-bold text-gray-600">{churchStats.byClassification['local'] || 0}</div>
              <div className="text-sm text-gray-800">Local</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo do Depósito */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Itens em Estoque</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inventoryStats.totalTypes}
            </div>
            <p className="text-xs text-muted-foreground">
              tipos diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total do Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(inventoryStats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor estimado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventoryStats.recentMovements.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma movimentação</p>
              ) : (
                inventoryStats.recentMovements.slice(0, 3).map((movement) => (
                  <div key={movement.id} className="text-xs">
                    <div className="font-medium truncate">{movement.nomeItem}</div>
                    <div className="text-muted-foreground">
                      {movement.tipoMovimentacao === 'entrada' ? '+' : '-'}{movement.quantidade} - {formatDate(movement.dataMovimentacao)}
                    </div>
                  </div>
                ))
              )}
              {inventoryStats.recentMovements.length > 3 && (
                <Link to="/deposito" className="text-xs text-blue-600 hover:underline">
                  Ver todas
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Itens com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventoryStats.lowStockItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Estoque OK</p>
              ) : (
                inventoryStats.lowStockItems.map((item) => (
                  <div key={item.id} className="text-xs">
                    <div className="font-medium truncate">{item.nomeItem}</div>
                    <div className="text-red-600">
                      {item.quantidadeEstoque} {item.unidadeMedida}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Pesquisa e Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Membros Cadastrados</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, função ou cidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>Função Ministerial</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'Nenhum membro encontrado' : 'Nenhum membro cadastrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {member.nomeCompleto}
                      </TableCell>
                      <TableCell>
                        <Badge className={getFunctionBadgeColor(member.funcaoMinisterial)}>
                          {member.funcaoMinisterial}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.telefone}</TableCell>
                      <TableCell>{member.cidade}</TableCell>
                      <TableCell>{member.estado}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link to={`/ficha/${member.id}`}>
                            <Button variant="outline" size="sm">
                              <File className="w-4 h-4 mr-1" />
                              Ficha
                            </Button>
                          </Link>
                          <Link to={`/membros/editar/${member.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(member.id, member.nomeCompleto)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
