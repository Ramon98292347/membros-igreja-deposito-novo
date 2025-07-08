import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Users, Edit, Trash2, Church } from 'lucide-react';
import { IgrejaData } from '@/hooks/useSupabaseIgreja';
import { useNavigate } from 'react-router-dom';

interface IgrejaCardProps {
  igreja: IgrejaData;
  showActions?: boolean;
  viewMode?: 'carousel' | 'list' | 'grid';
  onDelete?: (id: string, name: string) => void;
}

const IgrejaCard = ({ 
  igreja, 
  showActions = true, 
  viewMode = 'list',
  onDelete 
}: IgrejaCardProps) => {
  const navigate = useNavigate();

  const getClassificationBadgeColor = (classificacao: string) => {
    switch (classificacao?.toLowerCase()) {
      case 'estadual': return 'bg-blue-500 text-white';
      case 'setorial': return 'bg-green-500 text-white';
      case 'central': return 'bg-purple-500 text-white';
      case 'regional': return 'bg-orange-500 text-white';
      case 'local': return 'bg-gray-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (onDelete && igreja.id) {
      onDelete(igreja.id, igreja.nome_ipda || 'Igreja');
    }
  };

  const getActionButtons = () => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/igrejas/editar-igreja/${igreja.id}`)}
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
      </div>
    );
  };

  if (viewMode === 'carousel' || viewMode === 'grid') {
    return (
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Imagem da igreja - maior e no topo */}
          <div className="relative h-48 w-full">
            {igreja.imagem_igreja ? (
              <img 
                src={igreja.imagem_igreja} 
                alt={igreja.nome_ipda || 'Igreja'}
                className="w-full h-full object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-t-lg ${igreja.imagem_igreja ? 'hidden' : ''}`}>
              <Church className="w-16 h-16 text-white" />
            </div>
            
            {/* Badge de classificação sobreposto */}
            {igreja.classificacao && (
              <div className="absolute top-2 right-2">
                <Badge className={getClassificationBadgeColor(igreja.classificacao)}>
                  {igreja.classificacao.replace(/\./g, '').charAt(0).toUpperCase() + igreja.classificacao.replace(/\./g, '').slice(1)}
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {/* Nome da igreja */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {igreja.nome_ipda || 'Nome não informado'}
            </h3>

            {/* Informações principais */}
            <div className="space-y-2 text-sm text-gray-600 flex-1">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{igreja.telefone_pastor || 'Telefone não informado'}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{igreja.endereco_ipda || 'Endereço não informado'}</span>
              </div>
              
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{igreja.qtd_membros_atualmente_ipda || '0'} membros</span>
              </div>
              
              {igreja.totvs && (
                <div className="text-xs text-gray-500 mt-2">
                  <strong>TOTVS:</strong> {igreja.totvs}
                </div>
              )}
            </div>

            {/* Botões de ação */}
            {showActions && (
              <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/igrejas/editar-igreja/${igreja.id}`)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/ficha-igreja/${igreja.id}`)}
                  className="flex-1"
                >
                  Ficha
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modo lista (layout original)
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {igreja.imagem_igreja ? (
              <img 
                src={igreja.imagem_igreja} 
                alt={igreja.nome_ipda || 'Igreja'}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center ${igreja.imagem_igreja ? 'hidden' : ''}`}>
              <Church className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {igreja.nome_ipda || 'Nome não informado'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {igreja.classificacao && (
                    <span className="capitalize">{igreja.classificacao.replace(/\./g, '')}</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  {igreja.telefone_pastor || 'Telefone não informado'}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {igreja.endereco_ipda || 'Endereço não informado'}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Users className="w-4 h-4 mr-1" />
                  {igreja.qtd_membros_atualmente_ipda || '0'} membros
                </p>
                {igreja.totvs && (
                  <p className="text-xs text-gray-500 mt-1">
                    TOTVS: {igreja.totvs}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                {showActions && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/igrejas/editar-igreja/${igreja.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/ficha-igreja/${igreja.id}`)}
                    >
                      Ficha
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IgrejaCard;