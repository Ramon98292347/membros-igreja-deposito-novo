import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Calendar, FileText, Edit, Trash2 } from 'lucide-react';
import { Member } from '@/types/member';
import { useNavigate } from 'react-router-dom';

interface MemberCardProps {
  member: Member;
  showActions?: boolean;
  actionType?: 'ficha' | 'carteirinha' | 'edit';
  viewMode?: 'carousel' | 'list';
  onDelete?: (id: string, name: string) => void;
}

const MemberCard = ({ 
  member, 
  showActions = true, 
  actionType = 'edit', 
  viewMode = 'list',
  onDelete 
}: MemberCardProps) => {
  const navigate = useNavigate();

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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(member.id, member.nomeCompleto);
    }
  };

  const handleFichaClick = () => {
    if (member.linkFicha) {
      window.open(member.linkFicha, '_blank');
    }
  };

  const getActionButtons = () => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/membros/editar/${member.id}`)}
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
          onClick={handleFichaClick}
          disabled={!member.linkFicha}
        >
          <FileText className="w-4 h-4 mr-1" />
          Ficha
        </Button>
      </div>
    );
  };

  if (viewMode === 'carousel') {
    return (
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Foto grande no topo - similar ao IgrejaCard */}
           <div className="relative h-56 w-full">
            {member.imagem ? (
              <img
                 src={member.imagem}
                 alt={member.nomeCompleto}
                 className="w-full h-full object-contain rounded-t-lg"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-t-lg text-white font-semibold text-6xl ${member.imagem ? 'hidden' : ''}`}>
              {member.nomeCompleto.charAt(0).toUpperCase()}
            </div>
            
            {/* Badge de função sobreposto */}
            <div className="absolute top-2 right-2">
              <Badge className={getFunctionBadgeColor(member.funcaoMinisterial)}>
                {member.funcaoMinisterial}
              </Badge>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {/* Nome do membro */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {member.nomeCompleto}
            </h3>

            {/* Informações principais */}
            <div className="space-y-2 text-sm text-gray-600 flex-1">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{member.telefone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{member.cidade}, {member.estado}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {new Date(member.dataNascimento).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Botões de ação */}
            {showActions && (
              <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/membros/editar/${member.id}`)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                  size="sm"
                  onClick={handleFichaClick}
                  disabled={!member.linkFicha}
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
          {/* Foto do membro - maior */}
          <div className="flex-shrink-0">
            {member.imagem ? (
               <img
                 src={member.imagem}
                 alt={member.nomeCompleto}
                 className="w-20 h-20 rounded-lg object-contain"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.nextElementSibling?.classList.remove('hidden');
                 }}
               />
            ) : null}
            <div className={`w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-2xl ${member.imagem ? 'hidden' : ''}`}>
              {member.nomeCompleto.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Informações do membro */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {member.nomeCompleto}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <Badge className={getFunctionBadgeColor(member.funcaoMinisterial)}>
                    {member.funcaoMinisterial}
                  </Badge>
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  {member.telefone}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {member.cidade}, {member.estado}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(member.dataNascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                {showActions && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/membros/editar/${member.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                      onClick={handleFichaClick}
                      disabled={!member.linkFicha}
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

export default MemberCard;
