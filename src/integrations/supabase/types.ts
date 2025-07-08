export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      churches: {
        Row: {
          almasbatizadas: number | null
          classificacao: string | null
          dataatualizacao: string
          datacadastro: string
          diasfuncionamento: Json | null
          email: string | null
          endereco: Json | null
          foto: string | null
          id: string
          "link-ficha-igreja": string | null
          membrosatuais: number | null
          membrosiniciais: number | null
          nomeipda: string
          pastor: Json | null
          quantidadecriancas: number | null
          quantidademembros: number | null
          telefone: string | null
          temescola: boolean | null
          tipoipda: string | null
        }
        Insert: {
          almasbatizadas?: number | null
          classificacao?: string | null
          dataatualizacao?: string
          datacadastro?: string
          diasfuncionamento?: Json | null
          email?: string | null
          endereco?: Json | null
          foto?: string | null
          id?: string
          "link-ficha-igreja"?: string | null
          membrosatuais?: number | null
          membrosiniciais?: number | null
          nomeipda: string
          pastor?: Json | null
          quantidadecriancas?: number | null
          quantidademembros?: number | null
          telefone?: string | null
          temescola?: boolean | null
          tipoipda?: string | null
        }
        Update: {
          almasbatizadas?: number | null
          classificacao?: string | null
          dataatualizacao?: string
          datacadastro?: string
          diasfuncionamento?: Json | null
          email?: string | null
          endereco?: Json | null
          foto?: string | null
          id?: string
          "link-ficha-igreja"?: string | null
          membrosatuais?: number | null
          membrosiniciais?: number | null
          nomeipda?: string
          pastor?: Json | null
          quantidadecriancas?: number | null
          quantidademembros?: number | null
          telefone?: string | null
          temescola?: boolean | null
          tipoipda?: string | null
        }
        Relationships: []
      }
      igreja: {
        Row: {
          id: string
          nome_completo_pastor: string | null
          email_pastor: string | null
          telefone_pastor: string | null
          possui_cfo_pastor: string | null
          data_assumiu_ipda: string | null
          data_batismo_pastor: string | null
          estado_civil_pastor: string | null
          data_nascimento_pastor: string | null
          data_conclusao_cfo_pastor: string | null
          funcao_ministerial_pastor: string | null
          nome_ipda: string | null
          endereco_ipda: string | null
          tipo_ipda: string | null
          qtd_membros_assumiu_ipda: string | null
          qtd_membros_atualmente_ipda: string | null
          qtd_almas_batizadas_gestao: string | null
          tem_escola_pequeno_galileu: string | null
          qtd_criancas_escola: string | null
          dias_funcionamento_escola: string | null
          created_at: string | null
          updated_at: string | null
          totvs: string | null
          classificacao: string | null
          imagem_igreja: string | null
        }
        Insert: {
          id?: string
          nome_completo_pastor?: string | null
          email_pastor?: string | null
          telefone_pastor?: string | null
          possui_cfo_pastor?: string | null
          data_assumiu_ipda?: string | null
          data_batismo_pastor?: string | null
          estado_civil_pastor?: string | null
          data_nascimento_pastor?: string | null
          data_conclusao_cfo_pastor?: string | null
          funcao_ministerial_pastor?: string | null
          nome_ipda?: string | null
          endereco_ipda?: string | null
          tipo_ipda?: string | null
          qtd_membros_assumiu_ipda?: string | null
          qtd_membros_atualmente_ipda?: string | null
          qtd_almas_batizadas_gestao?: string | null
          tem_escola_pequeno_galileu?: string | null
          qtd_criancas_escola?: string | null
          dias_funcionamento_escola?: string | null
          created_at?: string | null
          updated_at?: string | null
          totvs?: string | null
          classificacao?: string | null
          imagem_igreja?: string | null
        }
        Update: {
          id?: string
          nome_completo_pastor?: string | null
          email_pastor?: string | null
          telefone_pastor?: string | null
          possui_cfo_pastor?: string | null
          data_assumiu_ipda?: string | null
          data_batismo_pastor?: string | null
          estado_civil_pastor?: string | null
          data_nascimento_pastor?: string | null
          data_conclusao_cfo_pastor?: string | null
          funcao_ministerial_pastor?: string | null
          nome_ipda?: string | null
          endereco_ipda?: string | null
          tipo_ipda?: string | null
          qtd_membros_assumiu_ipda?: string | null
          qtd_membros_atualmente_ipda?: string | null
          qtd_almas_batizadas_gestao?: string | null
          tem_escola_pequeno_galileu?: string | null
          qtd_criancas_escola?: string | null
          dias_funcionamento_escola?: string | null
          created_at?: string | null
          updated_at?: string | null
          totvs?: string | null
          classificacao?: string | null
          imagem_igreja?: string | null
        }
        Relationships: []
      }
      igreja_sistema: {
        Row: {
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          logo: string | null
          nome_igreja: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logo?: string | null
          nome_igreja: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logo?: string | null
          nome_igreja?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          codigo: string
          created_at: string
          descricao: string | null
          estoque_minimo: number | null
          id: string
          nome_item: string
          quantidade_estoque: number
          tipo_mercadoria: string
          unidade_medida: string
          updated_at: string
          valor_unitario: number
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao?: string | null
          estoque_minimo?: number | null
          id?: string
          nome_item: string
          quantidade_estoque?: number
          tipo_mercadoria: string
          unidade_medida: string
          updated_at?: string
          valor_unitario?: number
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string | null
          estoque_minimo?: number | null
          id?: string
          nome_item?: string
          quantidade_estoque?: number
          tipo_mercadoria?: string
          unidade_medida?: string
          updated_at?: string
          valor_unitario?: number
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          created_at: string
          data_movimentacao: string
          destino: string | null
          id: string
          igreja_destino_id: string | null
          igreja_origem_id: string | null
          item_id: string | null
          nome_igreja_destino: string | null
          nome_igreja_origem: string | null
          nome_item: string
          observacoes: string | null
          origem: string | null
          quantidade: number
          responsavel: string | null
          tipo_movimentacao: string
          usuario_responsavel: string | null
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          data_movimentacao: string
          destino?: string | null
          id?: string
          igreja_destino_id?: string | null
          igreja_origem_id?: string | null
          item_id?: string | null
          nome_igreja_destino?: string | null
          nome_igreja_origem?: string | null
          nome_item: string
          observacoes?: string | null
          origem?: string | null
          quantidade: number
          responsavel?: string | null
          tipo_movimentacao: string
          usuario_responsavel?: string | null
          valor_total?: number
          valor_unitario?: number
        }
        Update: {
          created_at?: string
          data_movimentacao?: string
          destino?: string | null
          id?: string
          igreja_destino_id?: string | null
          igreja_origem_id?: string | null
          item_id?: string | null
          nome_igreja_destino?: string | null
          nome_igreja_origem?: string | null
          nome_item?: string
          observacoes?: string | null
          origem?: string | null
          quantidade?: number
          responsavel?: string | null
          tipo_movimentacao?: string
          usuario_responsavel?: string | null
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transfers: {
        Row: {
          created_at: string
          data_transferencia: string
          id: string
          igreja_destino_id: string
          igreja_origem_id: string
          item_id: string | null
          nome_igreja_destino: string
          nome_igreja_origem: string
          nome_item: string
          observacoes: string | null
          quantidade: number
          responsavel_transferencia: string | null
          status: string
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          data_transferencia: string
          id?: string
          igreja_destino_id: string
          igreja_origem_id: string
          item_id?: string | null
          nome_igreja_destino: string
          nome_igreja_origem: string
          nome_item: string
          observacoes?: string | null
          quantidade: number
          responsavel_transferencia?: string | null
          status: string
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Update: {
          created_at?: string
          data_transferencia?: string
          id?: string
          igreja_destino_id?: string
          igreja_origem_id?: string
          item_id?: string | null
          nome_igreja_destino?: string
          nome_igreja_origem?: string
          nome_item?: string
          observacoes?: string | null
          quantidade?: number
          responsavel_transferencia?: string | null
          status?: string
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transfers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      membros: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          cep: string | null
          church_id: string | null
          cidade: string | null
          cidade_nascimento: string | null
          cpf: string | null
          dados_carteirinha: string | null
          created_at: string | null
          data_atualizacao: string | null
          data_batismo: string | null
          data_nascimento: string
          data_ordenacao: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          estado_cidade_nascimento: string | null
          estado_civil: string | null
          foto: string | null
          funcao_ministerial: string | null
          id: string
          idade: number | null
          igreja_batismo: string | null
          link_ficha: string | null
          nome_completo: string
          numero_casa: string | null
          observacoes: string | null
          profissao: string | null
          rg: string | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          church_id?: string | null
          cidade?: string | null
          cidade_nascimento?: string | null
          cpf?: string | null
          dados_carteirinha?: string | null
          created_at?: string | null
          data_atualizacao?: string | null
          data_batismo?: string | null
          data_nascimento: string
          data_ordenacao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_cidade_nascimento?: string | null
          estado_civil?: string | null
          foto?: string | null
          funcao_ministerial?: string | null
          id?: string
          idade?: number | null
          igreja_batismo?: string | null
          link_ficha?: string | null
          nome_completo: string
          numero_casa?: string | null
          observacoes?: string | null
          profissao?: string | null
          rg?: string | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          cep?: string | null
          church_id?: string | null
          cidade?: string | null
          cidade_nascimento?: string | null
          cpf?: string | null
          dados_carteirinha?: string | null
          created_at?: string | null
          data_atualizacao?: string | null
          data_batismo?: string | null
          data_nascimento?: string
          data_ordenacao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          estado_cidade_nascimento?: string | null
          estado_civil?: string | null
          foto?: string | null
          funcao_ministerial?: string | null
          id?: string
          idade?: number | null
          igreja_batismo?: string | null
          link_ficha?: string | null
          nome_completo?: string
          numero_casa?: string | null
          observacoes?: string | null
          profissao?: string | null
          rg?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      view_churches_relatorio: {
        Row: {
          almasbatizadas: number | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          classificacao: string | null
          cpf_pastor: string | null
          dataatualizacao: string | null
          datacadastro: string | null
          diasfuncionamento: Json | null
          email: string | null
          email_pastor: string | null
          estado: string | null
          foto: string | null
          funcao_pastor: string | null
          id: string | null
          membrosatuais: number | null
          membrosiniciais: number | null
          nome_completo_pastor: string | null
          nome_pastor: string | null
          nomeipda: string | null
          numero: string | null
          pastor_possui_cfo: string | null
          quantidadecriancas: number | null
          quantidademembros: number | null
          rua: string | null
          telefone: string | null
          telefone_pastor: string | null
          temescola: boolean | null
          tipoipda: string | null
          total_membros_cadastrados: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      buscar_aniversariantes_mes: {
        Args: { mes: number }
        Returns: {
          id: string
          nome_completo: string
          data_nascimento: string
          idade: number
          telefone: string
          funcao_ministerial: string
        }[]
      }
      buscar_igrejas_por_cidade: {
        Args: { cidade_nome: string }
        Returns: {
          id: string
          nomeipda: string
          classificacao: string
          tipoipda: string
          endereco: Json
          pastor: Json
          membrosiniciais: number
          membrosatuais: number
          quantidademembros: number
          almasbatizadas: number
          temescola: boolean
          quantidadecriancas: number
          diasfuncionamento: Json
          foto: string
          telefone: string
          email: string
        }[]
      }
      buscar_igrejas_por_estado: {
        Args: { estado_sigla: string }
        Returns: {
          id: string
          nomeipda: string
          classificacao: string
          tipoipda: string
          endereco: Json
          pastor: Json
          membrosiniciais: number
          membrosatuais: number
          quantidademembros: number
          almasbatizadas: number
          temescola: boolean
          quantidadecriancas: number
          diasfuncionamento: Json
          foto: string
          telefone: string
          email: string
        }[]
      }
      buscar_membros_por_funcao: {
        Args: { funcao: string }
        Returns: {
          id: string
          nome_completo: string
          telefone: string
          email: string
          cidade: string
          estado: string
          funcao_ministerial: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
