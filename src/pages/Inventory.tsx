import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useInventoryContext } from '@/context/InventoryContext';
import { useChurchContext } from '@/context/ChurchContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Package, TrendingUp, DollarSign, AlertTriangle, Grid, List, LayoutGrid, FileText, ArrowDown, ArrowUp, RefreshCw, ExternalLink } from 'lucide-react';
import InventoryItemCard from '@/components/InventoryItemCard';

const Inventory = () => {
  const navigate = useNavigate();
  const { 
    items, 
    searchItems, 
    deleteItem,
    getTotalStockValue, 
    getTotalItemTypes, 
    getLowStockItems,
    addEntry,
    addExit,
    addTransfer,
    getItemById
  } = useInventoryContext();
  const { churches } = useChurchContext();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'carousel' | 'grid'>('list');
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Estados para formulários
  const [entryForm, setEntryForm] = useState({
    itemId: '',
    quantidade: '',
    origem: '',
    responsavel: '',
    observacoes: ''
  });

  const [exitForm, setExitForm] = useState({
    itemId: '',
    quantidade: '',
    destino: '',
    responsavel: '',
    observacoes: ''
  });

  const [transferForm, setTransferForm] = useState({
    itemId: '',
    quantidade: '',
    igrejaOrigemId: '',
    igrejaDestinoId: '',
    responsavel: '',
    observacoes: ''
  });

  const filteredItems = searchQuery ? searchItems(searchQuery) : items;

  const inventoryStats = {
    totalItems: items.length,
    totalValue: getTotalStockValue(),
    totalTypes: getTotalItemTypes(),
    lowStockCount: getLowStockItems().length
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o item ${name}?`)) {
      deleteItem(id);
    }
  };

  const handleViewItemRecord = () => {
    if (!selectedItem) {
      toast({
        title: "Selecione um item",
        description: "Por favor, selecione um item para visualizar a ficha.",
        variant: "destructive",
      });
      return;
    }

    // Simular link da ficha do produto
    const fichaUrl = `https://ficha-produto.exemplo.com/${selectedItem}`;
    window.open(fichaUrl, '_blank');
  };

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const item = getItemById(entryForm.itemId);
      if (!item) {
        toast({
          title: "Erro",
          description: "Item não encontrado",
          variant: "destructive",
        });
        return;
      }

      await addEntry({
        itemId: entryForm.itemId,
        nomeItem: item.nomeItem,
        quantidade: parseInt(entryForm.quantidade),
        dataMovimentacao: new Date().toISOString().split('T')[0],
        origem: entryForm.origem,
        responsavel: entryForm.responsavel,
        observacoes: entryForm.observacoes,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorUnitario * parseInt(entryForm.quantidade),
        usuarioResponsavel: 'Sistema'
      });

      toast({
        title: "Sucesso",
        description: "Entrada registrada com sucesso!",
      });

      setEntryForm({
        itemId: '',
        quantidade: '',
        origem: '',
        responsavel: '',
        observacoes: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao registrar entrada",
        variant: "destructive",
      });
    }
  };

  const handleExit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const item = getItemById(exitForm.itemId);
      if (!item) {
        toast({
          title: "Erro",
          description: "Item não encontrado",
          variant: "destructive",
        });
        return;
      }

      await addExit({
        itemId: exitForm.itemId,
        nomeItem: item.nomeItem,
        quantidade: parseInt(exitForm.quantidade),
        dataMovimentacao: new Date().toISOString().split('T')[0],
        destino: exitForm.destino,
        responsavel: exitForm.responsavel,
        observacoes: exitForm.observacoes,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorUnitario * parseInt(exitForm.quantidade),
        usuarioResponsavel: 'Sistema'
      });

      toast({
        title: "Sucesso",
        description: "Saída registrada com sucesso!",
      });

      setExitForm({
        itemId: '',
        quantidade: '',
        destino: '',
        responsavel: '',
        observacoes: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao registrar saída",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const item = getItemById(transferForm.itemId);
      const igrejaOrigem = churches.find(c => c.id === transferForm.igrejaOrigemId);
      const igrejaDestino = churches.find(c => c.id === transferForm.igrejaDestinoId);

      if (!item || !igrejaOrigem || !igrejaDestino) {
        toast({
          title: "Erro",
          description: "Dados incompletos para transferência",
          variant: "destructive",
        });
        return;
      }

      await addTransfer({
        itemId: transferForm.itemId,
        nomeItem: item.nomeItem,
        quantidade: parseInt(transferForm.quantidade),
        igrejaOrigemId: transferForm.igrejaOrigemId,
        igrejaDestinoId: transferForm.igrejaDestinoId,
        nomeIgrejaOrigem: igrejaOrigem.nomeIPDA,
        nomeIgrejaDestino: igrejaDestino.nomeIPDA,
        dataTransferencia: new Date().toISOString().split('T')[0],
        responsavelTransferencia: transferForm.responsavel,
        observacoes: transferForm.observacoes,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorUnitario * parseInt(transferForm.quantidade),
        status: 'pendente'
      });

      toast({
        title: "Sucesso",
        description: "Transferência registrada com sucesso!",
      });

      setTransferForm({
        itemId: '',
        quantidade: '',
        igrejaOrigemId: '',
        igrejaDestinoId: '',
        responsavel: '',
        observacoes: ''
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao registrar transferência",
        variant: "destructive",
      });
    }
  };

  const renderItemsView = () => {
    if (filteredItems.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? 'Tente alterar os termos de busca.'
                : 'Comece adicionando o primeiro item ao estoque.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/deposito/item/novo')}
                className="church-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Item
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
              {filteredItems.map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <InventoryItemCard
                    item={item}
                    showActions={true}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              showActions={true}
              viewMode="carousel"
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            showActions={true}
            viewMode="list"
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Gestão de Estoque</h1>
          <p className="text-muted-foreground">Gerencie os itens do seu depósito</p>
        </div>
        <Button
          onClick={() => navigate('/deposito/item/novo')}
          className="church-gradient text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
            <p className="text-xs text-purple-100">
              itens cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(inventoryStats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              valor do estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Produtos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
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
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inventoryStats.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              itens em falta
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
          <TabsTrigger value="lista" className="text-xs sm:text-sm">
            <Package className="w-4 h-4 mr-1 sm:mr-2" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="fichas" className="text-xs sm:text-sm">
            <FileText className="w-4 h-4 mr-1 sm:mr-2" />
            Fichas
          </TabsTrigger>
          <TabsTrigger value="entrada" className="text-xs sm:text-sm">
            <ArrowDown className="w-4 h-4 mr-1 sm:mr-2" />
            Entrada
          </TabsTrigger>
          <TabsTrigger value="saida" className="text-xs sm:text-sm">
            <ArrowUp className="w-4 h-4 mr-1 sm:mr-2" />
            Saída
          </TabsTrigger>
          <TabsTrigger value="transferencia" className="text-xs sm:text-sm">
            <RefreshCw className="w-4 h-4 mr-1 sm:mr-2" />
            Transferência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
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

          <Card>
            <CardHeader>
              <CardTitle>Buscar Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, código ou tipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {renderItemsView()}
        </TabsContent>

        <TabsContent value="fichas">
          <Card>
            <CardHeader>
              <CardTitle>Ficha do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4">Ficha do Produto</h3>
                  <p className="text-muted-foreground mb-6">
                    Selecione um produto para visualizar sua ficha.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Selecionar Produto
                    </label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nomeItem} - {item.codigo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleViewItemRecord}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                      size="lg"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Ver Ficha do Produto
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entrada">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEntry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Produto *
                    </label>
                    <Select value={entryForm.itemId} onValueChange={(value) => setEntryForm({...entryForm, itemId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nomeItem} - {item.codigo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantidade *
                    </label>
                    <Input
                      type="number"
                      value={entryForm.quantidade}
                      onChange={(e) => setEntryForm({...entryForm, quantidade: e.target.value})}
                      placeholder="Digite a quantidade"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Origem *
                    </label>
                    <Input
                      value={entryForm.origem}
                      onChange={(e) => setEntryForm({...entryForm, origem: e.target.value})}
                      placeholder="Ex: Fornecedor, Compra, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Responsável *
                    </label>
                    <Input
                      value={entryForm.responsavel}
                      onChange={(e) => setEntryForm({...entryForm, responsavel: e.target.value})}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={entryForm.observacoes}
                    onChange={(e) => setEntryForm({...entryForm, observacoes: e.target.value})}
                    placeholder="Observações adicionais..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Registrar Entrada
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saida">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Saída</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Produto *
                    </label>
                    <Select value={exitForm.itemId} onValueChange={(value) => setExitForm({...exitForm, itemId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nomeItem} - {item.codigo} (Estoque: {item.quantidadeEstoque})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantidade *
                    </label>
                    <Input
                      type="number"
                      value={exitForm.quantidade}
                      onChange={(e) => setExitForm({...exitForm, quantidade: e.target.value})}
                      placeholder="Digite a quantidade"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Destino *
                    </label>
                    <Input
                      value={exitForm.destino}
                      onChange={(e) => setExitForm({...exitForm, destino: e.target.value})}
                      placeholder="Ex: Igreja, Venda, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Responsável *
                    </label>
                    <Input
                      value={exitForm.responsavel}
                      onChange={(e) => setExitForm({...exitForm, responsavel: e.target.value})}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={exitForm.observacoes}
                    onChange={(e) => setExitForm({...exitForm, observacoes: e.target.value})}
                    placeholder="Observações adicionais..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Registrar Saída
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transferencia">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Transferência</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Produto *
                    </label>
                    <Select value={transferForm.itemId} onValueChange={(value) => setTransferForm({...transferForm, itemId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nomeItem} - {item.codigo} (Estoque: {item.quantidadeEstoque})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantidade *
                    </label>
                    <Input
                      type="number"
                      value={transferForm.quantidade}
                      onChange={(e) => setTransferForm({...transferForm, quantidade: e.target.value})}
                      placeholder="Digite a quantidade"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Igreja Origem *
                    </label>
                    <Select value={transferForm.igrejaOrigemId} onValueChange={(value) => setTransferForm({...transferForm, igrejaOrigemId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a igreja origem..." />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id}>
                            {church.nomeIPDA}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Igreja Destino *
                    </label>
                    <Select value={transferForm.igrejaDestinoId} onValueChange={(value) => setTransferForm({...transferForm, igrejaDestinoId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a igreja destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id}>
                            {church.nomeIPDA}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Responsável *
                    </label>
                    <Input
                      value={transferForm.responsavel}
                      onChange={(e) => setTransferForm({...transferForm, responsavel: e.target.value})}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={transferForm.observacoes}
                    onChange={(e) => setTransferForm({...transferForm, observacoes: e.target.value})}
                    placeholder="Observações adicionais..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Registrar Transferência
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
