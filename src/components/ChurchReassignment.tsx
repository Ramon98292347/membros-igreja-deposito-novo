import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useChurchContext } from '@/context/ChurchContext';
import { useMemberContext } from '@/context/MemberContext';
import { FileText, Printer, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChurchReassignment = () => {
  const { churches } = useChurchContext();
  const { members } = useMemberContext();
  
  const [selectedChurch, setSelectedChurch] = useState('');
  const [selectedNewLeader, setSelectedNewLeader] = useState('');
  const [reassignmentReason, setReassignmentReason] = useState('');
  const [newLeaderDistance, setNewLeaderDistance] = useState('');
  const [receivesStipend, setReceivesStipend] = useState('');
  const [stipendSince, setStipendSince] = useState('');
  const [assumptionDate, setAssumptionDate] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Dados financeiros (campos manuais por enquanto)
  const [financialData, setFinancialData] = useState({
    currentIncome: '',
    expenses: '',
    balance: ''
  });

  // Dados do imóvel (campos manuais por enquanto)
  const [propertyData, setPropertyData] = useState({
    type: '',
    contractExpiry: '',
    hasLegalDocument: '',
    rentValue: ''
  });

  const selectedChurchData = churches.find(c => c.id === selectedChurch);
  const selectedNewLeaderData = members.find(m => m.id === selectedNewLeader);
  const currentLeader = selectedChurchData ? 
    members.find(m => m.cidade === selectedChurchData.endereco.cidade && 
                     (m.funcaoMinisterial === 'Pastor' || m.funcaoMinisterial === 'Presbítero')) : null;

  // Buscar pastor estadual e setorial (simulação - seria baseado na hierarquia real)
  const getStateAndRegionalPastors = () => {
    const statePastor = members.find(m => m.funcaoMinisterial === 'Pastor' && m.cidade === 'Vitória');
    const regionalPastor = members.find(m => m.funcaoMinisterial === 'Pastor' && m.cidade !== 'Vitória');
    
    return {
      statePastor: statePastor || null,
      regionalPastor: regionalPastor || null
    };
  };

  const { statePastor, regionalPastor } = getStateAndRegionalPastors();

  const generateDocument = () => {
    if (!selectedChurchData || !selectedNewLeaderData || !reassignmentReason) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setShowPreview(true);
  };

  const printDocument = () => {
    window.print();
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 no-print">
          <Button
            onClick={() => setShowPreview(false)}
            variant="outline"
          >
            Voltar
          </Button>
          <Button
            onClick={printDocument}
            className="church-gradient text-white"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>

        <Card className="print-card">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold">IGREJA PENTECOSTAL DEUS É AMOR</h1>
              <h2 className="text-lg font-semibold mt-2">DOCUMENTO DE REMANEJAMENTO</h2>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">DADOS DA IPDA</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {selectedChurchData?.nomeIPDA}</p>
                  <p><strong>Endereço:</strong> {selectedChurchData?.endereco.rua}, {selectedChurchData?.endereco.numero}</p>
                  <p><strong>Bairro:</strong> {selectedChurchData?.endereco.bairro}</p>
                  <p><strong>Cidade:</strong> {selectedChurchData?.endereco.cidade}, {selectedChurchData?.endereco.estado}</p>
                  <p><strong>CEP:</strong> {selectedChurchData?.endereco.cep}</p>
                  <p><strong>Porte:</strong> {selectedChurchData?.classificacao}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">SOBRE O IMÓVEL</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Tipo:</strong> {propertyData.type || 'Não informado'}</p>
                  {propertyData.type === 'Alugada' && (
                    <>
                      <p><strong>Contrato vence em:</strong> {propertyData.contractExpiry}</p>
                      <p><strong>Valor do Aluguel:</strong> R$ {propertyData.rentValue}</p>
                    </>
                  )}
                  {propertyData.type === 'Própria' && (
                    <p><strong>Tem escritura:</strong> {propertyData.hasLegalDocument}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">DADOS FINANCEIROS</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Entradas:</strong> R$ {financialData.currentIncome}</p>
                  <p><strong>Saídas:</strong> R$ {financialData.expenses}</p>
                  <p><strong>Saldo:</strong> R$ {financialData.balance}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">MEMBROS</h3>
                <p className="text-sm"><strong>Nº de Membros:</strong> {selectedChurchData?.membrosAtuais}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">MOTIVO</h3>
                <p className="text-sm">{reassignmentReason}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">DIRIGENTE QUE DEIXA</h3>
                {currentLeader && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Função:</strong> {currentLeader.funcaoMinisterial}</p>
                    <p><strong>Nome:</strong> {currentLeader.nomeCompleto}</p>
                    <p><strong>RG:</strong> {currentLeader.rg}</p>
                    <p><strong>CPF:</strong> {currentLeader.cpf}</p>
                    <p><strong>Telefone:</strong> {currentLeader.telefone}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-4">NOVO DIRIGENTE</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Função:</strong> {selectedNewLeaderData?.funcaoMinisterial}</p>
                  <p><strong>Nome:</strong> {selectedNewLeaderData?.nomeCompleto}</p>
                  <p><strong>Data de Batismo:</strong> {selectedNewLeaderData?.dataBatismo}</p>
                  <p><strong>RG:</strong> {selectedNewLeaderData?.rg}</p>
                  <p><strong>CPF:</strong> {selectedNewLeaderData?.cpf}</p>
                  <p><strong>Telefone:</strong> {selectedNewLeaderData?.telefone}</p>
                  <p><strong>Distância da IPDA:</strong> {newLeaderDistance} km</p>
                  <p><strong>Recebe prebenda:</strong> {receivesStipend}</p>
                  {receivesStipend === 'Sim' && (
                    <p><strong>Desde:</strong> {stipendSince}</p>
                  )}
                  <p><strong>Assume em:</strong> {assumptionDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">PR. ESTADUAL</h3>
                {statePastor && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Nome:</strong> {statePastor.nomeCompleto}</p>
                    <p><strong>CPF:</strong> {statePastor.cpf}</p>
                    <p><strong>Telefone:</strong> {statePastor.telefone}</p>
                    <p><strong>Email:</strong> {statePastor.enderecoEmail}</p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs">Assinatura do Pr. Estadual</p>
                      <div className="h-8 border-b border-gray-400 mt-2"></div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-4">PR. SETORIAL</h3>
                {regionalPastor && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Nome:</strong> {regionalPastor.nomeCompleto}</p>
                    <p><strong>CPF:</strong> {regionalPastor.cpf}</p>
                    <p><strong>Endereço:</strong> {regionalPastor.endereco}, {regionalPastor.cidade}</p>
                    <p><strong>Telefone:</strong> {regionalPastor.telefone}</p>
                    <p><strong>Email:</strong> {regionalPastor.enderecoEmail}</p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs">Assinatura do Pr. Setorial</p>
                      <div className="h-8 border-b border-gray-400 mt-2"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm">Data: {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
          </CardContent>
        </Card>

        <style>
          {`
            @media print {
              .no-print {
                display: none;
              }
              .print-card {
                box-shadow: none;
                border: none;
              }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Remanejamento de Dirigentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="church">IPDA para Remanejamento *</Label>
          <Select value={selectedChurch} onValueChange={setSelectedChurch}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a igreja" />
            </SelectTrigger>
            <SelectContent>
              {churches.map((church) => (
                <SelectItem key={church.id} value={church.id}>
                  {church.nomeIPDA} - {church.endereco.cidade}, {church.endereco.estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedChurchData && (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">Dados da IPDA Selecionada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nome:</strong> {selectedChurchData.nomeIPDA}
                </div>
                <div>
                  <strong>Classificação:</strong> {selectedChurchData.classificacao}
                </div>
                <div>
                  <strong>Endereço:</strong> {selectedChurchData.endereco.rua}, {selectedChurchData.endereco.numero}
                </div>
                <div>
                  <strong>Cidade:</strong> {selectedChurchData.endereco.cidade}, {selectedChurchData.endereco.estado}
                </div>
                <div>
                  <strong>Membros Atuais:</strong> {selectedChurchData.membrosAtuais}
                </div>
                <div>
                  <strong>Pastor Atual:</strong> {selectedChurchData.pastor.nomeCompleto}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="property-type">Tipo do Imóvel</Label>
            <Select value={propertyData.type} onValueChange={(value) => setPropertyData({...propertyData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alugada">Alugada</SelectItem>
                <SelectItem value="Própria">Própria</SelectItem>
                <SelectItem value="Comodato">Comodato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {propertyData.type === 'Alugada' && (
            <>
              <div>
                <Label htmlFor="contract-expiry">Contrato vence em</Label>
                <Input
                  id="contract-expiry"
                  type="date"
                  value={propertyData.contractExpiry}
                  onChange={(e) => setPropertyData({...propertyData, contractExpiry: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="rent-value">Valor do Aluguel (R$)</Label>
                <Input
                  id="rent-value"
                  type="number"
                  value={propertyData.rentValue}
                  onChange={(e) => setPropertyData({...propertyData, rentValue: e.target.value})}
                />
              </div>
            </>
          )}

          {propertyData.type === 'Própria' && (
            <div>
              <Label htmlFor="legal-document">Tem escritura?</Label>
              <Select value={propertyData.hasLegalDocument} onValueChange={(value) => setPropertyData({...propertyData, hasLegalDocument: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="current-income">Entradas Atuais (R$)</Label>
            <Input
              id="current-income"
              type="number"
              value={financialData.currentIncome}
              onChange={(e) => setFinancialData({...financialData, currentIncome: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="expenses">Saídas (R$)</Label>
            <Input
              id="expenses"
              type="number"
              value={financialData.expenses}
              onChange={(e) => setFinancialData({...financialData, expenses: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="balance">Saldo (R$)</Label>
            <Input
              id="balance"
              type="number"
              value={financialData.balance}
              onChange={(e) => setFinancialData({...financialData, balance: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Motivo da troca? Detalhar *</Label>
          <Textarea
            id="reason"
            value={reassignmentReason}
            onChange={(e) => setReassignmentReason(e.target.value)}
            placeholder="Descreva o motivo do remanejamento (ex: Desistência, Aposentadoria, Transferência)"
          />
        </div>

        <Separator />

        <div>
          <Label htmlFor="new-leader">Novo Dirigente *</Label>
          <Select value={selectedNewLeader} onValueChange={setSelectedNewLeader}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o novo dirigente" />
            </SelectTrigger>
            <SelectContent>
              {members.filter(m => ['Pastor', 'Presbítero', 'Cooperador'].includes(m.funcaoMinisterial)).map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.nomeCompleto} - {member.funcaoMinisterial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedNewLeaderData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance">Reside a quantos Km da IPDA?</Label>
              <Input
                id="distance"
                type="number"
                value={newLeaderDistance}
                onChange={(e) => setNewLeaderDistance(e.target.value)}
                placeholder="Distância em km"
              />
            </div>
            <div>
              <Label htmlFor="stipend">Recebe prebenda?</Label>
              <Select value={receivesStipend} onValueChange={setReceivesStipend}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {receivesStipend === 'Sim' && (
              <div>
                <Label htmlFor="stipend-since">Desde (data/ano)</Label>
                <Input
                  id="stipend-since"
                  value={stipendSince}
                  onChange={(e) => setStipendSince(e.target.value)}
                  placeholder="Ex: Janeiro/2024"
                />
              </div>
            )}
            <div>
              <Label htmlFor="assumption-date">Data que irá assumir</Label>
              <Input
                id="assumption-date"
                type="date"
                value={assumptionDate}
                onChange={(e) => setAssumptionDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <Button
          onClick={generateDocument}
          disabled={!selectedChurch || !selectedNewLeader || !reassignmentReason}
          className="w-full church-gradient text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Gerar Documento de Remanejamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChurchReassignment;
