
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemberContext } from '@/context/MemberContext';
import { Member } from '@/types/member';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { useCEP } from '@/hooks/useCEP';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addMember, updateMember, getMemberById, loading } = useMemberContext();
  const { fetchCEP, loading: cepLoading } = useCEP();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    imagem: '',
    enderecoEmail: '',
    endereco: '',
    bairro: '',
    numeroCasa: '',
    cidade: '',
    estado: '',
    cep: '',
    cpf: '',
    rg: '',
    cidadeNascimento: '',
    estadoCidadeNascimento: '',
    dataNascimento: '',
    idade: 0,
    estadoCivil: 'Solteiro' as Member['estadoCivil'],
    telefone: '',
    profissao: '',
    temFilho: false,
    dataBatismo: '',

    funcaoMinisterial: 'Membro' as Member['funcaoMinisterial']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const member = getMemberById(id);
      if (member) {
        setFormData({
          nomeCompleto: member.nomeCompleto,
          imagem: member.imagem || '',
          enderecoEmail: member.enderecoEmail || '',
          endereco: member.endereco,
          bairro: member.bairro,
          numeroCasa: member.numeroCasa,
          cidade: member.cidade,
          estado: member.estado,
          cep: member.cep,
          cpf: member.cpf,
          rg: member.rg,
          cidadeNascimento: member.cidadeNascimento,
          estadoCidadeNascimento: member.estadoCidadeNascimento,
          dataNascimento: member.dataNascimento,
          idade: member.idade,
          estadoCivil: member.estadoCivil,
          telefone: member.telefone,
          profissao: member.profissao,
          temFilho: member.temFilho,
          dataBatismo: member.dataBatismo,

          funcaoMinisterial: member.funcaoMinisterial
        });
      }
    }
  }, [id, isEditing, getMemberById]);

  // Calcular idade automaticamente
  useEffect(() => {
    if (formData.dataNascimento) {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, idade: age }));
    }
  }, [formData.dataNascimento]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCEPChange = async (cep: string) => {
    handleInputChange('cep', cep);
    
    // Buscar endereço automaticamente quando CEP tiver 8 dígitos
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      const cepData = await fetchCEP(cleanCEP);
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          endereco: cepData.logradouro,
          bairro: cepData.bairro,
          cidade: cepData.localidade,
          estado: cepData.uf
        }));
      }
    }
  };

  const handleCPFChange = (cpf: string) => {
    // Remove todos os caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Aplica a máscara do CPF
    let formattedCPF = cleanCPF;
    if (cleanCPF.length >= 4) {
      formattedCPF = cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3);
    }
    if (cleanCPF.length >= 7) {
      formattedCPF = cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3, 6) + '.' + cleanCPF.slice(6);
    }
    if (cleanCPF.length >= 10) {
      formattedCPF = cleanCPF.slice(0, 3) + '.' + cleanCPF.slice(3, 6) + '.' + cleanCPF.slice(6, 9) + '-' + cleanCPF.slice(9, 11);
    }
    
    // Limita a 11 dígitos
    if (cleanCPF.length <= 11) {
      handleInputChange('cpf', formattedCPF);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Campos obrigatórios
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    }
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }
    if (!formData.dataBatismo) {
      newErrors.dataBatismo = 'Data de batismo é obrigatória';
    }

    // Validação de email
    if (formData.enderecoEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.enderecoEmail)) {
      newErrors.enderecoEmail = 'Email inválido';
    }

    // Validação de CPF (formato básico)
    if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato 000.000.000-00';
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
      setSubmitting(true);
      
      if (isEditing && id) {
        await updateMember(id, formData);
        toast({
          title: "Membro atualizado",
          description: "Os dados do membro foram atualizados com sucesso."
        });
      } else {
        await addMember(formData);
        toast({
          title: "Membro cadastrado",
          description: "O novo membro foi cadastrado com sucesso."
        });
      }
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {isEditing ? 'Editar Membro' : 'Cadastrar Novo Membro'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize os dados do membro' : 'Preencha os dados do novo membro'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                  className={errors.nomeCompleto ? 'border-red-500' : ''}
                />
                {errors.nomeCompleto && <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto}</p>}
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  value={formData.imagem}
                  onChange={(value) => handleInputChange('imagem', value)}
                  label="Foto do Membro"
                />
              </div>

              <div>
                <Label htmlFor="enderecoEmail">Endereço de Email</Label>
                <Input
                  id="enderecoEmail"
                  type="email"
                  value={formData.enderecoEmail}
                  onChange={(e) => handleInputChange('enderecoEmail', e.target.value)}
                  className={errors.enderecoEmail ? 'border-red-500' : ''}
                />
                {errors.enderecoEmail && <p className="text-sm text-red-500 mt-1">{errors.enderecoEmail}</p>}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(00) 99999-9999"
                  className={errors.telefone ? 'border-red-500' : ''}
                />
                {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleCEPChange(e.target.value)}
                  placeholder="00000-000"
                  disabled={cepLoading}
                />
                {cepLoading && <p className="text-sm text-blue-500 mt-1">Buscando endereço...</p>}
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className={errors.endereco ? 'border-red-500' : ''}
                />
                {errors.endereco && <p className="text-sm text-red-500 mt-1">{errors.endereco}</p>}
              </div>

              <div>
                <Label htmlFor="numeroCasa">Número da Casa</Label>
                <Input
                  id="numeroCasa"
                  value={formData.numeroCasa}
                  onChange={(e) => handleInputChange('numeroCasa', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  className={errors.cidade ? 'border-red-500' : ''}
                />
                {errors.cidade && <p className="text-sm text-red-500 mt-1">{errors.cidade}</p>}
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className={errors.estado ? 'border-red-500' : ''}
                />
                {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado}</p>}
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-red-500' : ''}
                  maxLength={14}
                />
                {errors.cpf && <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>}
              </div>

              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={formData.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cidadeNascimento">Cidade de Nascimento</Label>
                <Input
                  id="cidadeNascimento"
                  value={formData.cidadeNascimento}
                  onChange={(e) => handleInputChange('cidadeNascimento', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="estadoCidadeNascimento">Estado da Cidade de Nascimento</Label>
                <Input
                  id="estadoCidadeNascimento"
                  value={formData.estadoCidadeNascimento}
                  onChange={(e) => handleInputChange('estadoCidadeNascimento', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  className={errors.dataNascimento ? 'border-red-500' : ''}
                />
                {errors.dataNascimento && <p className="text-sm text-red-500 mt-1">{errors.dataNascimento}</p>}
              </div>

              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={formData.idade}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(value) => handleInputChange('estadoCivil', value)}>
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
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dataBatismo">Data de Batismo *</Label>
                <Input
                  id="dataBatismo"
                  type="date"
                  value={formData.dataBatismo}
                  onChange={(e) => handleInputChange('dataBatismo', e.target.value)}
                  className={errors.dataBatismo ? 'border-red-500' : ''}
                />
                {errors.dataBatismo && <p className="text-sm text-red-500 mt-1">{errors.dataBatismo}</p>}
              </div>



              <div>
                <Label htmlFor="funcaoMinisterial">Função Ministerial</Label>
                <Select value={formData.funcaoMinisterial} onValueChange={(value) => handleInputChange('funcaoMinisterial', value)}>
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
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/')}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="church-gradient text-white"
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : (isEditing ? 'Atualizar Membro' : 'Cadastrar Membro')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
