import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChurchContext } from '@/context/ChurchContext';
import { useIgrejaContext } from '@/context/IgrejaContext';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useToast } from '@/hooks/use-toast';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Plus, Search, Church, MapPin, Users, TrendingUp, Building, FileText, RefreshCw, ExternalLink, Filter, Grid, List, LayoutGrid } from 'lucide-react';
import ChurchCard from '@/components/ChurchCard';
import IgrejaCard from '@/components/IgrejaCard';
import InfiniteScroll from '@/components/InfiniteScroll';

const ChurchManagement = () => {
  const navigate = useNavigate();
  const { churches, searchChurches } = useChurchContext();
  const { igrejas, loading: igrejaLoading, getIgrejaStats, deleteIgreja, searchIgrejas, filterByClassificacao } = useIgrejaContext();
  const { sendChurchData } = useN8nWebhook();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChurch, setSelectedChurch] = useState<string>('');
  const [classificacaoFilter, setClassificacaoFilter] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'list' | 'carousel' | 'grid'>('list');

  // Filtrar igrejas por classificação e busca
  const igrejasByClassification = filterByClassificacao(classificacaoFilter);
  const filteredIgrejas = searchQuery ? 
    searchIgrejas(searchQuery).filter(igreja => 
      classificacaoFilter === 'todas' || igreja.classificacao?.toLowerCase() === classificacaoFilter.toLowerCase()
    ) : igrejasByClassification;

  // Implementar lazy loading para as igrejas
  const {
    visibleItems: visibleIgrejas,
    hasMore,
    loadMore,
    isLoading: isLoadingMore
  } = useLazyLoading(filteredIgrejas, {
    itemsPerPage: 18,
    initialLoad: 18
  });

  // Estatísticas das igrejas da tabela 'igreja'
  const igrejaStats = getIgrejaStats();
  
  // Estatísticas das igrejas antigas (fallback)
  const churchStats = {
    total: churches.length,
    principais: churches.filter(c => c.tipoIPDA === 'Sede').length,
    congregacoes: churches.filter(c => c.tipoIPDA === 'Congregação').length,
    pontos: churches.filter(c => c.tipoIPDA === 'Ponto de Pregação').length
  };

  // Usar estatísticas da tabela 'igreja' se disponível, senão usar as antigas
  const displayStats = igrejaStats.total > 0 ? {
    total: igrejaStats.total,
    estadual: igrejaStats.byClassification.estadual || 0,
    setorial: igrejaStats.byClassification.setorial || 0,
    central: igrejaStats.byClassification.central || 0,
    regional: igrejaStats.byClassification.regional || 0,
    local: igrejaStats.byClassification.local || 0,
    totalMembros: igrejaStats.totalMembers,
    totalBatizados: igrejaStats.totalBaptized
  } : {
    total: churchStats.total,
    estadual: 0,
    setorial: 0,
    central: 0,
    regional: 0,
    local: 0,
    totalMembros: 0,
    totalBatizados: 0
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a igreja ${name}?`)) {
      try {
        await deleteIgreja(id);
        toast({
          title: "Sucesso",
          description: "Igreja excluída com sucesso!",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir igreja",
          variant: "destructive",
        });
      }
    }
  };

  const handleWebhookAction = async (actionType: string, data: any) => {
    try {
      await sendChurchData('create', {
        action: actionType,
        data: data,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Sucesso",
        description: `Dados enviados para o webhook com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar dados para o webhook",
        variant: "destructive",
      });
    }
  };

  const handleViewChurchRecord = () => {
    if (!selectedChurch) {
      toast({
        title: "Selecione uma igreja",
        description: "Por favor, selecione uma igreja para visualizar a ficha.",
        variant: "destructive",
      });
      return;
    }

    const church = churches.find(c => c.id === selectedChurch);
    if (!church) {
      toast({
        title: "Igreja não encontrada",
        description: "A igreja selecionada não foi encontrada.",
        variant: "destructive",
      });
      return;
    }

    if (!church['link-ficha-igreja']) {
      toast({
        title: "Link não disponível",
        description: "Esta igreja não possui um link de ficha cadastrado.",
        variant: "destructive",
      });
      return;
    }

    window.open(church['link-ficha-igreja'], '_blank');
  };



  const renderIgrejasView = () => {
    if (filteredIgrejas.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <Church className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || classificacaoFilter !== 'todas' ? 'Nenhuma igreja encontrada' : 'Nenhuma igreja cadastrada'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || classificacaoFilter !== 'todas'
                ? 'Tente alterar os termos de busca ou filtros.'
                : 'Comece adicionando a primeira igreja.'}
            </p>
            {!searchQuery && classificacaoFilter === 'todas' && (
              <Button
                onClick={() => navigate('/igrejas/nova-igreja')}
                className="church-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Igreja
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    if (viewMode === 'grid') {
      return (
        <InfiniteScroll
          hasMore={hasMore}
          isLoading={isLoadingMore}
          onLoadMore={loadMore}
          threshold={300}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleIgrejas.map((igreja) => (
              <IgrejaCard
                key={igreja.id}
                igreja={igreja}
                showActions={true}
                viewMode="grid"
                onDelete={handleDelete}
              />
            ))}
          </div>
        </InfiniteScroll>
      );
    }

    // Lista padrão
    return (
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoadingMore}
        onLoadMore={loadMore}
        threshold={300}
      >
        <div className="grid gap-4">
          {visibleIgrejas.map((igreja) => (
            <IgrejaCard
              key={igreja.id}
              igreja={igreja}
              showActions={true}
              viewMode="list"
              onDelete={handleDelete}
            />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  const renderChurchesList = () => {
    // Priorizar dados da tabela 'igreja' se disponível
    const hasIgrejaData = igrejas.length > 0;
    const hasOldChurchData = churches.length > 0;
    const filteredChurches = searchQuery ? searchChurches(searchQuery) : churches;

    return (
      <div className="space-y-6">
        {igrejaLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <p>Carregando igrejas...</p>
            </CardContent>
          </Card>
        )}
        
        {/* Renderizar igrejas da tabela 'igreja' */}
        {hasIgrejaData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Igrejas do Sistema ({filteredIgrejas.length})</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {renderIgrejasView()}
          </div>
        )}
        
        {/* Renderizar igrejas antigas se existirem e não houver dados da tabela igreja */}
        {!hasIgrejaData && hasOldChurchData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Igrejas Cadastradas ({filteredChurches.length})</h3>
            </div>
            <div className="grid gap-4">
              {filteredChurches.map((church) => (
                <ChurchCard key={church.id} church={church} />
              ))}
            </div>
          </div>
        )}
        
        {/* Caso não tenha dados em nenhuma tabela */}
        {!hasIgrejaData && !hasOldChurchData && (
          <Card>
            <CardContent className="text-center py-12">
              <Church className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma igreja cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando a primeira igreja.
              </p>
              <Button
                onClick={() => navigate('/igrejas/nova-igreja')}
                className="church-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Igreja
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderFichaIgrejaContent = () => {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-4">Ficha da Igreja</h3>
          <p className="text-muted-foreground mb-6">
            Selecione uma igreja para visualizar sua ficha.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selecionar Igreja
            </label>
            <select
              value={selectedChurch}
              onChange={(e) => setSelectedChurch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma igreja...</option>
              {churches.map((church) => (
                <option key={church.id} value={church.id}>
                  {church.nomeIPDA}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleViewChurchRecord}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
              size="lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Ver Ficha da Igreja
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderRemanejamentoContent = () => {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-4">Remanejamento de Igreja</h3>
        <p className="text-muted-foreground mb-6">
          Gerencie transferências e remanejamentos entre igrejas.
        </p>
        <Button
          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfUaFHQtYTWw60A7R8dDWdYwGw2_dX8YjArjypBzeCaklgu_Q/viewform?usp=sf_link', '_blank')}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
          size="lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Iniciar Remanejamento
        </Button>
      </div>
    );
  };

  const renderContratosContent = () => {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-purple-500 mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-4">Contratos da Igreja</h3>
        <p className="text-muted-foreground mb-6">
          Acesse e gerencie contratos relacionados às igrejas.
        </p>
        <Button
          onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSc_YGx4Dvri4rCIR9sByyaMaMwdFItVSL-UBd3HH_OAVU0qvQ/viewform?usp=dialog', '_blank')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 text-lg"
          size="lg"
        >
          <FileText className="w-5 h-5 mr-2" />
          Gerenciar Contratos
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Gestão de Igrejas</h1>
          <p className="text-muted-foreground">Gerencie as igrejas da sua região</p>
        </div>
        <Button
          onClick={() => navigate('/igrejas/nova-igreja')}
          className="church-gradient text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Igreja
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Igrejas</CardTitle>
            <Church className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.total}</div>
            <p className="text-xs text-blue-100">igrejas cadastradas</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${classificacaoFilter === 'estadual' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setClassificacaoFilter(classificacaoFilter === 'estadual' ? 'todas' : 'estadual')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estadual</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{displayStats.estadual}</div>
            <p className="text-xs text-muted-foreground">
              estaduais {classificacaoFilter === 'estadual' && '(filtro ativo)'}
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${classificacaoFilter === 'setorial' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setClassificacaoFilter(classificacaoFilter === 'setorial' ? 'todas' : 'setorial')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setorial</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{displayStats.setorial}</div>
            <p className="text-xs text-muted-foreground">
              setoriais {classificacaoFilter === 'setorial' && '(filtro ativo)'}
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${classificacaoFilter === 'central' ? 'ring-2 ring-purple-500' : ''}`}
          onClick={() => setClassificacaoFilter(classificacaoFilter === 'central' ? 'todas' : 'central')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Central</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{displayStats.central}</div>
            <p className="text-xs text-muted-foreground">
              centrais {classificacaoFilter === 'central' && '(filtro ativo)'}
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            classificacaoFilter === 'regional' ? 'ring-2 ring-orange-500' : ''
          }`}
          onClick={() => {
            if (classificacaoFilter === 'regional') {
              setClassificacaoFilter('todas');
            } else {
              setClassificacaoFilter('regional');
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regional</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{displayStats.regional}</div>
            <p className="text-xs text-muted-foreground">
              regionais {classificacaoFilter === 'regional' && '(filtro ativo)'}
            </p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            classificacaoFilter === 'local' ? 'ring-2 ring-gray-500' : ''
          }`}
          onClick={() => {
            if (classificacaoFilter === 'local') {
              setClassificacaoFilter('todas');
            } else {
              setClassificacaoFilter('local');
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local</CardTitle>
            <Building className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{displayStats.local}</div>
            <p className="text-xs text-muted-foreground">
              locais {classificacaoFilter === 'local' && '(filtro ativo)'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas adicionais */}
      {displayStats.totalMembros > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{displayStats.totalMembros}</div>
              <p className="text-xs text-muted-foreground">membros ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Batizados</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{displayStats.totalBatizados}</div>
              <p className="text-xs text-muted-foreground">almas batizadas</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="lista" className="text-xs sm:text-sm">
            <Church className="w-4 h-4 mr-1 sm:mr-2" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="fichas" className="text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            Fichas
          </TabsTrigger>
          <TabsTrigger value="remanejamento" className="text-xs sm:text-sm">
            <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
            Remanejamento
          </TabsTrigger>
          <TabsTrigger value="contratos" className="text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            Contratos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar e Filtrar Igrejas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, cidade, estado, pastor ou classificação..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtrar por classificação:</span>
                  </div>
                  <Select value={classificacaoFilter} onValueChange={setClassificacaoFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas as classificações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as classificações</SelectItem>
                      <SelectItem value="estadual">Estadual</SelectItem>
                      <SelectItem value="setorial">Setorial</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {(searchQuery || classificacaoFilter !== 'todas') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setClassificacaoFilter('todas');
                      }}
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
                
                {filteredIgrejas.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Mostrando {filteredIgrejas.length} igreja(s) 
                    {classificacaoFilter !== 'todas' && ` da classificação "${classificacaoFilter}"`}
                    {searchQuery && ` com o termo "${searchQuery}"`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {renderChurchesList()}
        </TabsContent>

        <TabsContent value="fichas">
          <Card>
            <CardHeader>
              <CardTitle>Ficha da Igreja</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFichaIgrejaContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remanejamento">
          <Card>
            <CardHeader>
              <CardTitle>Remanejamento de Igreja</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRemanejamentoContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contratos">
          <Card>
            <CardHeader>
              <CardTitle>Contratos da Igreja</CardTitle>
            </CardHeader>
            <CardContent>
              {renderContratosContent()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChurchManagement;
