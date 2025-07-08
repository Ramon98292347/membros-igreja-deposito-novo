import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseIgreja, IgrejaData } from '@/hooks/useSupabaseIgreja';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const IgrejaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { igrejas, addIgreja, updateIgreja } = useSupabaseIgreja();
  const [loading, setLoading] = useState(false);

  // Função para formatar datas para o formato YYYY-MM-DD esperado pelos inputs de data
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    
    try {
      // Se já está no formato YYYY-MM-DD, retorna como está
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Verifica se é formato brasileiro DD/MM/YYYY
      const brDateMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (brDateMatch) {
        const [, day, month, year] = brDateMatch;
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log(`Convertendo data brasileira ${dateString} para ${formattedDate}`);
        return formattedDate;
      }
      
      // Verifica se é formato ISO com hora (YYYY-MM-DDTHH:mm:ss)
      if (dateString.includes('T')) {
        const isoDate = dateString.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
          console.log(`Extraindo data de ISO: ${dateString} -> ${isoDate}`);
          return isoDate;
        }
      }
      
      // Tenta converter outros formatos usando Date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Data inválida:', dateString);
        return '';
      }
      
      const formatted = date.toISOString().split('T')[0];
      console.log(`Convertendo data: ${dateString} -> ${formatted}`);
      return formatted;
    } catch (error) {
      console.error('Erro ao formatar data:', dateString, error);
      return '';
    }
  };
  const [formData, setFormData] = useState<Partial<IgrejaData>>({
    nome_ipda: '',
    classificacao: 'local',
    tipo_ipda: '',
    endereco_ipda: '',
    nome_completo_pastor: '',
    email_pastor: '',
    telefone_pastor: '',
    funcao_ministerial_pastor: '',
    estado_civil_pastor: 'Solteiro',
    data_nascimento_pastor: '',
    data_batismo_pastor: '',
    data_assumiu_ipda: '',
    possui_cfo_pastor: 'Não',
    data_conclusao_cfo_pastor: '',
    qtd_membros_assumiu_ipda: '0',
    qtd_membros_atualmente_ipda: '0',
    qtd_almas_batizadas_gestao: '0',
    tem_escola_pequeno_galileu: 'Não',
    qtd_criancas_escola: '0',
    dias_funcionamento_escola: '',
    totvs: '',
    imagem_igreja: ''
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && id && igrejas.length > 0) {
      const igreja = igrejas.find(i => i.id === id);
      if (igreja) {
        console.log('Carregando dados da igreja para edição:', igreja);
        
        // Formatar as datas antes de definir no formData
        const dadosFormatados = {
          ...igreja,
          data_nascimento_pastor: formatDateForInput(igreja.data_nascimento_pastor),
          data_batismo_pastor: formatDateForInput(igreja.data_batismo_pastor),
          data_assumiu_ipda: formatDateForInput(igreja.data_assumiu_ipda),
          data_conclusao_cfo_pastor: formatDateForInput(igreja.data_conclusao_cfo_pastor)
        };
        
        console.log('Dados formatados com datas:', dadosFormatados);
        setFormData(dadosFormatados);
      } else {
        console.log('Igreja não encontrada com ID:', id);
        toast({
          title: "Aviso",
          description: "Igreja não encontrada. Redirecionando...",
          variant: "destructive"
        });
        navigate('/igrejas');
      }
    }
  }, [id, isEditing, igrejas, navigate]);

  const handleInputChange = (field: keyof IgrejaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome_ipda?.trim()) {
      toast({
        title: "Erro",
        description: "Nome da igreja é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing && id) {
        await updateIgreja(id, formData);
      } else {
        await addIgreja(formData as Omit<IgrejaData, 'id' | 'created_at' | 'updated_at'>);
      }
      navigate('/igrejas');
    } catch (error) {
      console.error('Erro ao salvar igreja:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/igrejas')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {isEditing ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Atualize os dados da igreja' : 'Preencha os dados da nova igreja'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos da Igreja */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos da Igreja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_ipda">Nome da Igreja *</Label>
                <Input
                  id="nome_ipda"
                  value={formData.nome_ipda || ''}
                  onChange={(e) => handleInputChange('nome_ipda', e.target.value)}
                  placeholder="Ex: IPDA Central"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="classificacao">Classificação *</Label>
                <Select 
                  value={formData.classificacao || 'local'} 
                  onValueChange={(value) => handleInputChange('classificacao', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estadual">Estadual</SelectItem>
                    <SelectItem value="setorial">Setorial</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipo_ipda">Tipo da Igreja</Label>
                <Input
                  id="tipo_ipda"
                  value={formData.tipo_ipda || ''}
                  onChange={(e) => handleInputChange('tipo_ipda', e.target.value)}
                  placeholder="Ex: Sede, Congregação, Ponto de Pregação"
                />
              </div>

              <div>
                <Label htmlFor="totvs">Código TOTVS</Label>
                <Input
                  id="totvs"
                  value={formData.totvs || ''}
                  onChange={(e) => handleInputChange('totvs', e.target.value)}
                  placeholder="Código no sistema TOTVS"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco_ipda">Endereço da Igreja</Label>
              <Textarea
                id="endereco_ipda"
                value={formData.endereco_ipda || ''}
                onChange={(e) => handleInputChange('endereco_ipda', e.target.value)}
                placeholder="Endereço completo da igreja"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="imagem_igreja">URL da Imagem da Igreja</Label>
              <Input
                id="imagem_igreja"
                value={formData.imagem_igreja || ''}
                onChange={(e) => handleInputChange('imagem_igreja', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                type="url"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Pastor */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Pastor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_completo_pastor">Nome Completo do Pastor</Label>
                <Input
                  id="nome_completo_pastor"
                  value={formData.nome_completo_pastor || ''}
                  onChange={(e) => handleInputChange('nome_completo_pastor', e.target.value)}
                  placeholder="Nome completo do pastor"
                />
              </div>

              <div>
                <Label htmlFor="funcao_ministerial_pastor">Função Ministerial</Label>
                <Input
                  id="funcao_ministerial_pastor"
                  value={formData.funcao_ministerial_pastor || ''}
                  onChange={(e) => handleInputChange('funcao_ministerial_pastor', e.target.value)}
                  placeholder="Ex: Pastor, Presbítero, Evangelista"
                />
              </div>

              <div>
                <Label htmlFor="email_pastor">Email do Pastor</Label>
                <Input
                  id="email_pastor"
                  type="email"
                  value={formData.email_pastor || ''}
                  onChange={(e) => handleInputChange('email_pastor', e.target.value)}
                  placeholder="pastor@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="telefone_pastor">Telefone do Pastor</Label>
                <Input
                  id="telefone_pastor"
                  value={formData.telefone_pastor || ''}
                  onChange={(e) => handleInputChange('telefone_pastor', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="data_nascimento_pastor">Data de Nascimento</Label>
                <Input
                  id="data_nascimento_pastor"
                  type="date"
                  value={formData.data_nascimento_pastor || ''}
                  onChange={(e) => handleInputChange('data_nascimento_pastor', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="estado_civil_pastor">Estado Civil</Label>
                <Select 
                  value={formData.estado_civil_pastor || 'Solteiro'} 
                  onValueChange={(value) => handleInputChange('estado_civil_pastor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro</SelectItem>
                    <SelectItem value="Casado">Casado</SelectItem>
                    <SelectItem value="Divorciado">Divorciado</SelectItem>
                    <SelectItem value="Viúvo">Viúvo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_batismo_pastor">Data do Batismo</Label>
                <Input
                  id="data_batismo_pastor"
                  type="date"
                  value={formData.data_batismo_pastor || ''}
                  onChange={(e) => handleInputChange('data_batismo_pastor', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="data_assumiu_ipda">Data que Assumiu a Igreja</Label>
                <Input
                  id="data_assumiu_ipda"
                  type="date"
                  value={formData.data_assumiu_ipda || ''}
                  onChange={(e) => handleInputChange('data_assumiu_ipda', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="possui_cfo_pastor">Possui CFO?</Label>
                <Select 
                  value={formData.possui_cfo_pastor || 'Não'} 
                  onValueChange={(value) => handleInputChange('possui_cfo_pastor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Possui CFO?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_conclusao_cfo_pastor">Data de Conclusão do CFO</Label>
                <Input
                  id="data_conclusao_cfo_pastor"
                  type="date"
                  value={formData.data_conclusao_cfo_pastor || ''}
                  onChange={(e) => handleInputChange('data_conclusao_cfo_pastor', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Estatísticos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Estatísticos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="qtd_membros_assumiu_ipda">Membros ao Assumir</Label>
                <Input
                  id="qtd_membros_assumiu_ipda"
                  type="number"
                  value={formData.qtd_membros_assumiu_ipda || '0'}
                  onChange={(e) => handleInputChange('qtd_membros_assumiu_ipda', e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="qtd_membros_atualmente_ipda">Membros Atualmente</Label>
                <Input
                  id="qtd_membros_atualmente_ipda"
                  type="number"
                  value={formData.qtd_membros_atualmente_ipda || '0'}
                  onChange={(e) => handleInputChange('qtd_membros_atualmente_ipda', e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="qtd_almas_batizadas_gestao">Almas Batizadas na Gestão</Label>
                <Input
                  id="qtd_almas_batizadas_gestao"
                  type="number"
                  value={formData.qtd_almas_batizadas_gestao || '0'}
                  onChange={(e) => handleInputChange('qtd_almas_batizadas_gestao', e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escola Pequeno Galileu */}
        <Card>
          <CardHeader>
            <CardTitle>Escola Pequeno Galileu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tem_escola_pequeno_galileu">Tem Escola?</Label>
                <Select 
                  value={formData.tem_escola_pequeno_galileu || 'Não'} 
                  onValueChange={(value) => handleInputChange('tem_escola_pequeno_galileu', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tem escola?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="qtd_criancas_escola">Quantidade de Crianças</Label>
                <Input
                  id="qtd_criancas_escola"
                  type="number"
                  value={formData.qtd_criancas_escola || '0'}
                  onChange={(e) => handleInputChange('qtd_criancas_escola', e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="dias_funcionamento_escola">Dias de Funcionamento</Label>
                <Input
                  id="dias_funcionamento_escola"
                  value={formData.dias_funcionamento_escola || ''}
                  onChange={(e) => handleInputChange('dias_funcionamento_escola', e.target.value)}
                  placeholder="Ex: Segunda a Sexta"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/igrejas')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="church-gradient text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Igreja' : 'Cadastrar Igreja')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default IgrejaForm;