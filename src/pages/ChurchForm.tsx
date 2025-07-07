
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useChurchContext } from '@/context/ChurchContext';
import { Church } from '@/types/church';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { useCEP } from '@/hooks/useCEP';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';

const ChurchForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addChurch, updateChurch, getChurchById } = useChurchContext();
  const { fetchCEP, loading: cepLoading } = useCEP();
  const { sendChurchData, loading: webhookLoading } = useN8nWebhook();
  const isEditing = Boolean(id);

  const diasSemana = [
    { id: 'segunda', label: 'Segunda-feira' },
    { id: 'terca', label: 'Terça-feira' },
    { id: 'quarta', label: 'Quarta-feira' },
    { id: 'quinta', label: 'Quinta-feira' },
    { id: 'sexta', label: 'Sexta-feira' },
    { id: 'sabado', label: 'Sábado' },
    { id: 'domingo', label: 'Domingo' }
  ];

  const [formData, setFormData] = useState({
    imagem: '',
    totvs: '',
    classificacao: 'Local' as Church['classificacao'],
    nomeIPDA: '',
    tipoIPDA: 'Congregação' as Church['tipoIPDA'],
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    pastor: {
      nomeCompleto: '',
      telefone: '',
      email: '',
      dataNascimento: '',
      dataBatismo: '',
      estadoCivil: 'Solteiro' as Church['pastor']['estadoCivil'],
      funcaoMinisterial: '',
      possuiCFO: false,
      dataConclusaoCFO: '',
      dataAssumiu: ''
    },
    membrosIniciais: 0,
    membrosAtuais: 0,
    almasBatizadas: 0,
    temEscola: false,
    quantidadeCriancas: 0,
    diasFuncionamento: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      const church = getChurchById(id);
      if (church) {
        setFormData({
          imagem: church.imagem || '',
          totvs: church.totvs || '',
          classificacao: church.classificacao,
          nomeIPDA: church.nomeIPDA,
          tipoIPDA: church.tipoIPDA,
          endereco: { ...church.endereco },
          pastor: { ...church.pastor, dataConclusaoCFO: church.pastor.dataConclusaoCFO || '' },
          membrosIniciais: church.membrosIniciais,
          membrosAtuais: church.membrosAtuais,
          almasBatizadas: church.almasBatizadas,
          temEscola: church.temEscola,
          quantidadeCriancas: church.quantidadeCriancas || 0,
          diasFuncionamento: Array.isArray(church.diasFuncionamento) ? church.diasFuncionamento : []
        });
      }
    }
  }, [id, isEditing, getChurchById]);

  const handleInputChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...(prev[nested as keyof typeof prev] as object),
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDiaChange = (diaId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      diasFuncionamento: checked 
        ? [...prev.diasFuncionamento, diaId]
        : prev.diasFuncionamento.filter(dia => dia !== diaId)
    }));
  };

  const handleCEPChange = async (cep: string) => {
    handleInputChange('cep', cep, 'endereco');
    
    // Buscar endereço automaticamente quando CEP tiver 8 dígitos
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      const cepData = await fetchCEP(cleanCEP);
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: cepData.logradouro,
            bairro: cepData.bairro,
            cidade: cepData.localidade,
            estado: cepData.uf
          }
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeIPDA.trim()) {
      newErrors.nomeIPDA = 'Nome da IPDA é obrigatório';
    }
    if (!formData.pastor.nomeCompleto.trim()) {
      newErrors.pastorNome = 'Nome do pastor é obrigatório';
    }
    if (!formData.endereco.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!formData.endereco.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }
    if (!formData.pastor.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos em destaque.",
        variant: "destructive"
      });
      return;
    }

    try {
      const churchData = {
        ...formData,
        pastor: {
          ...formData.pastor,
          possuiCFO: formData.pastor.possuiCFO,
          dataConclusaoCFO: formData.pastor.possuiCFO ? formData.pastor.dataConclusaoCFO : undefined
        },
        quantidadeCriancas: formData.temEscola ? formData.quantidadeCriancas : undefined,
        diasFuncionamento: formData.temEscola ? formData.diasFuncionamento : undefined
      };

      if (isEditing && id) {
        await updateChurch(id, churchData);
        
        // Enviar dados para n8n webhook
        try {
          await sendChurchData('update', { id, ...churchData });
          console.log('Dados de atualização da igreja enviados para n8n');
        } catch (webhookError) {
          console.error('Erro ao enviar para webhook:', webhookError);
          // Continua mesmo se o webhook falhar
        }

        toast({
          title: "Igreja atualizada",
          description: "Os dados da igreja foram atualizados com sucesso."
        });
      } else {
        await addChurch(churchData);
        
        // Enviar dados para n8n webhook
        try {
          await sendChurchData('create', churchData);
          console.log('Dados de criação da igreja enviados para n8n');
        } catch (webhookError) {
          console.error('Erro ao enviar para webhook:', webhookError);
          // Continua mesmo se o webhook falhar
        }

        toast({
          title: "Igreja cadastrada",
          description: "A nova igreja foi cadastrada com sucesso."
        });
      }
      navigate('/igrejas');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {isEditing ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize os dados da igreja' : 'Preencha os dados da nova igreja'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <ImageUpload
                  value={formData.imagem}
                  onChange={(value) => handleInputChange('imagem', value)}
                  label="Foto da Igreja"
                />
              </div>

              <div>
                <Label htmlFor="totvs">TOtvs</Label>
                <Input
                  id="totvs"
                  value={formData.totvs}
                  onChange={(e) => handleInputChange('totvs', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="classificacao">Classificação *</Label>
                <Select value={formData.classificacao} onValueChange={(value) => handleInputChange('classificacao', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estadual">Estadual</SelectItem>
                    <SelectItem value="Setorial">Setorial</SelectItem>
                    <SelectItem value="Central">Central</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipoIPDA">Esta IPDA é *</Label>
                <Select value={formData.tipoIPDA} onValueChange={(value) => handleInputChange('tipoIPDA', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sede">Sede</SelectItem>
                    <SelectItem value="Congregação">Congregação</SelectItem>
                    <SelectItem value="Ponto de Pregação">Ponto de Pregação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="nomeIPDA">Nome da IPDA *</Label>
                <Input
                  id="nomeIPDA"
                  value={formData.nomeIPDA}
                  onChange={(e) => handleInputChange('nomeIPDA', e.target.value)}
                  className={errors.nomeIPDA ? 'border-red-500' : ''}
                />
                {errors.nomeIPDA && <p className="text-sm text-red-500 mt-1">{errors.nomeIPDA}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.endereco.cep}
                  onChange={(e) => handleCEPChange(e.target.value)}
                  placeholder="00000-000"
                  disabled={cepLoading}
                />
                {cepLoading && <p className="text-sm text-blue-500 mt-1">Buscando endereço...</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.endereco.rua}
                  onChange={(e) => handleInputChange('rua', e.target.value, 'endereco')}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.endereco.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value, 'endereco')}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.endereco.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value, 'endereco')}
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.endereco.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value, 'endereco')}
                  className={errors.cidade ? 'border-red-500' : ''}
                />
                {errors.cidade && <p className="text-sm text-red-500 mt-1">{errors.cidade}</p>}
              </div>
              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={formData.endereco.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value, 'endereco')}
                  className={errors.estado ? 'border-red-500' : ''}
                />
                {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado}</p>}
              </div>
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
              <div className="md:col-span-2">
                <Label htmlFor="pastorNome">Nome Completo do Pastor *</Label>
                <Input
                  id="pastorNome"
                  value={formData.pastor.nomeCompleto}
                  onChange={(e) => handleInputChange('nomeCompleto', e.target.value, 'pastor')}
                  className={errors.pastorNome ? 'border-red-500' : ''}
                />
                {errors.pastorNome && <p className="text-sm text-red-500 mt-1">{errors.pastorNome}</p>}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.pastor.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value, 'pastor')}
                  placeholder="(00) 99999-9999"
                  className={errors.telefone ? 'border-red-500' : ''}
                />
                {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.pastor.email}
                  onChange={(e) => handleInputChange('email', e.target.value, 'pastor')}
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.pastor.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value, 'pastor')}
                />
              </div>

              <div>
                <Label htmlFor="dataBatismo">Data do Batismo</Label>
                <Input
                  id="dataBatismo"
                  type="date"
                  value={formData.pastor.dataBatismo}
                  onChange={(e) => handleInputChange('dataBatismo', e.target.value, 'pastor')}
                />
              </div>

              <div>
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.pastor.estadoCivil} onValueChange={(value) => handleInputChange('estadoCivil', value, 'pastor')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro">Solteiro</SelectItem>
                    <SelectItem value="Casado">Casado</SelectItem>
                    <SelectItem value="Viúvo">Viúvo</SelectItem>
                    <SelectItem value="Divorciado">Divorciado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="funcaoMinisterial">Função Ministerial</Label>
                <Select value={formData.pastor.funcaoMinisterial} onValueChange={(value) => handleInputChange('funcaoMinisterial', value, 'pastor')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Membro">Membro</SelectItem>
                    <SelectItem value="Obreiro">Obreiro</SelectItem>
                    <SelectItem value="Diácono">Diácono</SelectItem>
                    <SelectItem value="Presbítero">Presbítero</SelectItem>
                    <SelectItem value="Pastor">Pastor</SelectItem>
                    <SelectItem value="Missionário">Missionário</SelectItem>
                    <SelectItem value="Evangelista">Evangelista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="possuiCFO">Possui o curso de CFO</Label>
                <Select value={formData.pastor.possuiCFO ? 'Sim' : 'Não'} onValueChange={(value) => handleInputChange('possuiCFO', value === 'Sim', 'pastor')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.pastor.possuiCFO && (
                <div>
                  <Label htmlFor="dataConclusaoCFO">Data da Conclusão CFO</Label>
                  <Input
                    id="dataConclusaoCFO"
                    type="date"
                    value={formData.pastor.dataConclusaoCFO}
                    onChange={(e) => handleInputChange('dataConclusaoCFO', e.target.value, 'pastor')}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="dataAssumiu">Data que assumiu a IPDA</Label>
                <Input
                  id="dataAssumiu"
                  type="date"
                  value={formData.pastor.dataAssumiu}
                  onChange={(e) => handleInputChange('dataAssumiu', e.target.value, 'pastor')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados da Gestão */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Gestão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="membrosIniciais">Quantidade de membros quando assumiu a IPDA</Label>
                <Input
                  id="membrosIniciais"
                  type="number"
                  value={formData.membrosIniciais}
                  onChange={(e) => handleInputChange('membrosIniciais', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="membrosAtuais">Quantidade de membros atualmente</Label>
                <Input
                  id="membrosAtuais"
                  type="number"
                  value={formData.membrosAtuais}
                  onChange={(e) => handleInputChange('membrosAtuais', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="almasBatizadas">Quantidade de almas batizadas na gestão deste pastor</Label>
                <Input
                  id="almasBatizadas"
                  type="number"
                  value={formData.almasBatizadas}
                  onChange={(e) => handleInputChange('almasBatizadas', parseInt(e.target.value) || 0)}
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
            <div>
              <Label htmlFor="temEscola">Tem a escola o Pequeno Galileu</Label>
              <Select value={formData.temEscola ? 'Sim' : 'Não'} onValueChange={(value) => handleInputChange('temEscola', value === 'Sim')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.temEscola && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantidadeCriancas">Quantas crianças tem na escola</Label>
                  <Input
                    id="quantidadeCriancas"
                    type="number"
                    value={formData.quantidadeCriancas}
                    onChange={(e) => handleInputChange('quantidadeCriancas', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Dias que funciona</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {diasSemana.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={dia.id}
                          checked={formData.diasFuncionamento.includes(dia.id)}
                          onCheckedChange={(checked) => handleDiaChange(dia.id, checked as boolean)}
                        />
                        <Label htmlFor={dia.id} className="text-sm">{dia.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/igrejas')}>
            Cancelar
          </Button>
          <Button type="submit" className="church-gradient text-white" disabled={webhookLoading}>
            {webhookLoading ? 'Salvando...' : (isEditing ? 'Atualizar Igreja' : 'Cadastrar Igreja')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChurchForm;
