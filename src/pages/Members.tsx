import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useMemberContext } from '@/context/MemberContext';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { Plus, Search, Users, FileText, CreditCard, MessageSquare, TrendingUp, UserCheck, Calendar, Grid, List, LayoutGrid, ExternalLink } from 'lucide-react';
import MemberCard from '@/components/MemberCard';
import InfiniteScroll from '@/components/InfiniteScroll';

const Members = () => {
  const navigate = useNavigate();
  const { members, searchMembers, deleteMember } = useMemberContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'carousel' | 'grid'>('list');

  const filteredMembers = searchQuery ? searchMembers(searchQuery) : members;
  
  // Implementar lazy loading para os membros
  const {
    visibleItems: visibleMembers,
    hasMore,
    loadMore,
    isLoading: isLoadingMore
  } = useLazyLoading(filteredMembers, {
    itemsPerPage: 20,
    initialLoad: 20
  });

  const getFunctionBadgeColor = (funcao: string) => {
    switch (funcao) {
      case 'Pastor': return 'bg-purple-100 text-purple-800';
      case 'Presbítero': return 'bg-blue-100 text-blue-800';
      case 'Diácono': return 'bg-green-100 text-green-800';
      case 'Obreiro': return 'bg-yellow-100 text-yellow-800';
      case 'Missionário': return 'bg-red-100 text-red-800';
      case 'Evangelista': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const memberStats = {
    total: members.length,
    newThisMonth: members.filter(m => {
      const memberDate = new Date(m.dataCadastro);
      const now = new Date();
      return memberDate.getMonth() === now.getMonth() && memberDate.getFullYear() === now.getFullYear();
    }).length,
    baptized: members.filter(m => m.dataBatismo).length,
    byFunction: members.reduce((acc, member) => {
      acc[member.funcaoMinisterial] = (acc[member.funcaoMinisterial] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o membro ${name}?`)) {
      try {
        await deleteMember(id);
        console.log(`Membro ${name} excluído com sucesso`);
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
        alert(`Erro ao excluir o membro ${name}. Tente novamente.`);
      }
    }
  };

  const renderMembersView = () => {
    if (filteredMembers.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Nenhum membro encontrado' : 'Nenhum membro cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Tente alterar os termos de busca.'
                : 'Comece adicionando o primeiro membro da sua igreja.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/membros/novo')}
                className="church-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Membro
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    if (viewMode === 'carousel') {
      return (
        <div className="px-4 sm:px-8">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {visibleMembers.map((member) => (
                <CarouselItem key={member.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <MemberCard
                    member={member}
                    showActions={true}
                    actionType="edit"
                    viewMode="carousel"
                    onDelete={handleDelete}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
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
            {visibleMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                showActions={true}
                actionType="edit"
                viewMode="carousel"
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
          {visibleMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              showActions={true}
              actionType="edit"
              viewMode="list"
              onDelete={handleDelete}
            />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  const renderFichasContent = () => {
    const membersWithFichas = filteredMembers.filter(member => member.linkFicha);
    
    // Lazy loading para fichas
    const {
      visibleItems: visibleFichas,
      hasMore: hasMoreFichas,
      loadMore: loadMoreFichas,
      isLoading: isLoadingMoreFichas
    } = useLazyLoading(membersWithFichas, {
      itemsPerPage: 15,
      initialLoad: 15
    });
    
    if (membersWithFichas.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma ficha disponível</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Nenhum membro encontrado com ficha cadastrada.'
              : 'Nenhum membro possui ficha cadastrada ainda.'}
          </p>
        </div>
      );
    }

    return (
      <InfiniteScroll
        hasMore={hasMoreFichas}
        isLoading={isLoadingMoreFichas}
        onLoadMore={loadMoreFichas}
        threshold={300}
      >
        <div className="grid gap-4">
          {visibleFichas.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {member.imagem ? (
                        <img
                          src={member.imagem}
                          alt={member.nomeCompleto}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {member.nomeCompleto.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.nomeCompleto}</h3>
                      <Badge className={getFunctionBadgeColor(member.funcaoMinisterial)}>
                        {member.funcaoMinisterial}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(member.linkFicha, '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Ver Ficha
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  const renderCarteirinhasContent = () => {
    const membersWithCarteirinhas = filteredMembers.filter(member => member.dadosCarteirinha);
    
    if (membersWithCarteirinhas.length === 0) {
      return (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma carteirinha disponível</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Nenhum membro encontrado com carteirinha cadastrada.'
              : 'Nenhum membro possui carteirinha cadastrada ainda.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {membersWithCarteirinhas.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {member.imagem ? (
                      <img
                        src={member.imagem}
                        alt={member.nomeCompleto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {member.nomeCompleto.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.nomeCompleto}</h3>
                    <Badge className={getFunctionBadgeColor(member.funcaoMinisterial)}>
                      {member.funcaoMinisterial}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(member.dadosCarteirinha, '_blank')}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Ver Carteirinha
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Gestão de Membros</h1>
          <p className="text-muted-foreground">Gerencie os membros da sua igreja</p>
        </div>
        <Button
          onClick={() => navigate('/membros/novo')}
          className="church-gradient text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.total}</div>
            <p className="text-xs text-blue-100">
              membros cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {memberStats.newThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">
              novos membros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Batizados</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {memberStats.baptized}
            </div>
            <p className="text-xs text-muted-foreground">
              batizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obreiros</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {memberStats.byFunction['Obreiro'] || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              em ministério
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="lista" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Lista de </span>Membros
            </TabsTrigger>
            <TabsTrigger value="fichas" className="text-xs sm:text-sm">
              <FileText className="w-4 h-4 mr-1 sm:mr-2" />
              Fichas
            </TabsTrigger>
            <TabsTrigger value="carteirinhas" className="text-xs sm:text-sm">
              <CreditCard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Carteirinhas</span><span className="sm:hidden">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="cartas" className="text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 mr-1 sm:mr-2" />
              Cartas
            </TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
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
            <Button
              variant={viewMode === 'carousel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('carousel')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, função, cidade ou telefone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {renderMembersView()}
        </TabsContent>

        <TabsContent value="fichas">
          <Card>
            <CardHeader>
              <CardTitle>Fichas de Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {renderFichasContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carteirinhas">
          <Card>
            <CardHeader>
              <CardTitle>Carteirinhas de Membros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {renderCarteirinhasContent()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartas">
          <Card>
            <CardHeader>
              <CardTitle>Cartas de Pregação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">Crie sua Carta de Pregação</h3>
                <p className="text-muted-foreground mb-6">
                  Acesse o formulário para criar sua carta de pregação personalizada.
                </p>
                <Button
                  onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdSVw-IaYhPO6hEYgPuSD0ZYQNwYdDoeszqF-Dgk7ZA4OunRg/viewform?usp=sf_link', '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Faça a sua Carta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Members;
