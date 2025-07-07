
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Users, Edit, Building, FileText, Trash2 } from 'lucide-react';
import { Church } from '@/types/church';
import { useNavigate } from 'react-router-dom';

interface ChurchCardProps {
  church: Church;
  showActions?: boolean;
  viewMode?: 'carousel' | 'list';
  onDelete?: (id: string, name: string) => void;
}

const ChurchCard = ({ church, showActions = true, viewMode = 'list', onDelete }: ChurchCardProps) => {
  const navigate = useNavigate();

  const getClassificationBadgeColor = (classificacao: string) => {
    switch (classificacao) {
      case 'Estadual': return 'bg-blue-100 text-blue-800';
      case 'Setorial': return 'bg-green-100 text-green-800';
      case 'Central': return 'bg-purple-100 text-purple-800';
      case 'Regional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(church.id, church.nomeIPDA);
    }
  };

  const getActionButtons = () => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/igrejas/editar/${church.id}`)}
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
          onClick={() => navigate(`/igrejas/ficha/${church.id}`)}
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
          {/* Foto grande no topo */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {church.imagem ? (
                <img
                  src={church.imagem}
                  alt={church.nomeIPDA}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                  <Building className="w-12 h-12 sm:w-16 sm:h-16" />
                </div>
              )}
            </div>
          </div>

          {/* Nome centralizado */}
          <div className="text-center mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
              {church.nomeIPDA}
            </h3>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <Badge className={getClassificationBadgeColor(church.classificacao)}>
                {church.classificacao}
              </Badge>
              <Badge variant="outline">
                {church.tipoIPDA}
              </Badge>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="text-center">
              <span className="font-medium">Pastor:</span>
              <div className="truncate">{church.pastor.nomeCompleto}</div>
            </div>
            
            <div className="flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center truncate">
                {church.endereco.cidade}, {church.endereco.estado}
              </span>
            </div>
            
            <div className="flex items-center justify-center">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-center">
                {church.membrosAtuais} membros • {church.almasBatizadas} batizados
              </span>
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
          {/* Foto da igreja */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {church.imagem ? (
                <img
                  src={church.imagem}
                  alt={church.nomeIPDA}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                  <Building className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {/* Informações da igreja */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate mb-2 sm:mb-0">
                {church.nomeIPDA}
              </h3>
              {showActions && (
                <div className="flex-shrink-0">
                  {getActionButtons()}
                </div>
              )}
            </div>

            <div className="mb-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <Badge className={getClassificationBadgeColor(church.classificacao)}>
                {church.classificacao}
              </Badge>
              <Badge variant="outline">
                {church.tipoIPDA}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium mr-2">Pastor:</span>
                <span className="truncate">{church.pastor.nomeCompleto}</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {church.endereco.cidade}, {church.endereco.estado}
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{church.membrosAtuais} membros</span>
                <span className="mx-2">•</span>
                <span>{church.almasBatizadas} batizados</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChurchCard;
