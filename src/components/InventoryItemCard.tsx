
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingDown, TrendingUp, Edit, FileText, Trash2 } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';
import { useNavigate } from 'react-router-dom';

interface InventoryItemCardProps {
  item: InventoryItem;
  showActions?: boolean;
  viewMode?: 'carousel' | 'list';
  onDelete?: (id: string, name: string) => void;
}

const InventoryItemCard = ({ item, showActions = true, viewMode = 'list', onDelete }: InventoryItemCardProps) => {
  const navigate = useNavigate();

  const getTypeBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'Manuais Bíblicos - Aluno': 'bg-blue-100 text-blue-800',
      'Manuais Bíblicos - Professor': 'bg-purple-100 text-purple-800',
      'Bíblias': 'bg-green-100 text-green-800',
      'Hinários/Livretos': 'bg-yellow-100 text-yellow-800',
      'Revistas': 'bg-orange-100 text-orange-800',
      'Vestuário': 'bg-pink-100 text-pink-800',
      'Acessórios': 'bg-cyan-100 text-cyan-800',
      'CDs Cantados': 'bg-red-100 text-red-800',
      'CDs Oração': 'bg-indigo-100 text-indigo-800',
      'CDs Instrumental': 'bg-gray-100 text-gray-800',
      'CDs Espanhol': 'bg-teal-100 text-teal-800',
      'CDs Playbacks': 'bg-lime-100 text-lime-800',
      'Outros': 'bg-slate-100 text-slate-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isLowStock = item.quantidadeEstoque <= (item.estoqueMinimo || 10);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item.id, item.nomeItem);
    }
  };

  const getActionButtons = () => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/deposito/item/editar/${item.id}`)}
          className="flex-1 sm:flex-none"
        >
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex-1 sm:flex-none"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white flex-1 sm:flex-none"
          size="sm"
          onClick={() => navigate(`/deposito/item/ficha/${item.id}`)}
        >
          <FileText className="w-4 h-4 mr-1" />
          Ficha
        </Button>
      </div>
    );
  };

  if (viewMode === 'carousel') {
    return (
      <Card className="hover:shadow-lg transition-shadow w-full max-w-sm mx-auto">
        <CardContent className="p-4">
          {/* Ícone grande no topo */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                <Package className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>
          </div>

          {/* Nome e código centralizados */}
          <div className="text-center mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate">
              {item.nomeItem}
            </h3>
            <p className="text-sm text-gray-500 mb-2">#{item.codigo}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className={getTypeBadgeColor(item.tipoMercadoria)}>
                {item.tipoMercadoria}
              </Badge>
              {isLowStock && (
                <Badge variant="destructive">
                  Estoque Baixo
                </Badge>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-center">
              {isLowStock ? (
                <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              )}
              <span className={`text-center font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                {item.quantidadeEstoque} {item.unidadeMedida}
              </span>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-green-600">
                {formatCurrency(item.valorUnitario)}
              </div>
              <div className="text-xs text-gray-500">por unidade</div>
            </div>
            
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {formatCurrency(item.valorUnitario * item.quantidadeEstoque)}
              </div>
              <div className="text-xs text-gray-500">valor total</div>
            </div>
          </div>

          {/* Botões de ação */}
          {showActions && (
            <div className="flex flex-col space-y-2">
              {getActionButtons()}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Modo lista (layout original)
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Ícone do item */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                <Package className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Informações do item */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                  {item.nomeItem}
                </h3>
                <p className="text-sm text-gray-500">#{item.codigo}</p>
              </div>
              {showActions && (
                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  {getActionButtons()}
                </div>
              )}
            </div>

            <div className="mb-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge className={getTypeBadgeColor(item.tipoMercadoria)}>
                {item.tipoMercadoria}
              </Badge>
              {isLowStock && (
                <Badge variant="destructive">
                  Estoque Baixo
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center sm:justify-start">
                {isLowStock ? (
                  <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                ) : (
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                )}
                <span className={`font-medium ${isLowStock ? 'text-red-600' : ''}`}>
                  Estoque: {item.quantidadeEstoque} {item.unidadeMedida}
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <span className="mr-2">Valor unitário:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(item.valorUnitario)}
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <span className="mr-2">Valor total:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(item.valorUnitario * item.quantidadeEstoque)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;
