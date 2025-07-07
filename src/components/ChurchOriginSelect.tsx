
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIgrejaSistema } from '@/hooks/useIgrejaSistema';

interface ChurchOriginSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const ChurchOriginSelect = ({ 
  value, 
  onChange, 
  label = "Igreja de Origem",
  placeholder = "Nome da igreja será carregado automaticamente",
  disabled = false 
}: ChurchOriginSelectProps) => {
  const { igrejaSistema, loading } = useIgrejaSistema();
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    if (igrejaSistema?.nome_igreja && !value) {
      const churchName = igrejaSistema.nome_igreja;
      setDisplayValue(churchName);
      if (onChange) {
        onChange(churchName);
      }
    }
  }, [igrejaSistema, value, onChange]);

  useEffect(() => {
    if (value) {
      setDisplayValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="igreja-origem">{label}</Label>
      <Input
        id="igreja-origem"
        value={displayValue}
        onChange={handleChange}
        placeholder={loading ? "Carregando..." : placeholder}
        disabled={disabled || loading}
        className="w-full"
      />
      {igrejaSistema && (
        <p className="text-xs text-muted-foreground">
          Dados carregados das configurações da igreja
        </p>
      )}
    </div>
  );
};

export default ChurchOriginSelect;
