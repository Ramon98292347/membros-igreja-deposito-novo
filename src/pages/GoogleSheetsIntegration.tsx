
import GoogleSheetsSync from '@/components/GoogleSheetsSync';

const GoogleSheetsIntegration = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Integração Google Sheets</h1>
        <p className="text-muted-foreground">
          Sincronize os dados dos membros diretamente da sua planilha Google
        </p>
      </div>
      
      <GoogleSheetsSync />
    </div>
  );
};

export default GoogleSheetsIntegration;
