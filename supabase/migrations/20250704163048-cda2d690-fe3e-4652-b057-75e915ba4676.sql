
-- Atualizar as políticas RLS para a tabela membros
-- Primeiro, remover as políticas existentes
DROP POLICY IF EXISTS "Usuários autenticados podem ler membros" ON public.membros;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir membros" ON public.membros;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar membros" ON public.membros;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir membros" ON public.membros;

-- Criar novas políticas mais permissivas para membros
CREATE POLICY "Permitir todas operações para usuários autenticados - membros SELECT" 
  ON public.membros FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - membros INSERT" 
  ON public.membros FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - membros UPDATE" 
  ON public.membros FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - membros DELETE" 
  ON public.membros FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Atualizar as políticas RLS para a tabela churches
-- Primeiro, remover as políticas existentes
DROP POLICY IF EXISTS "Usuários autenticados podem ler igrejas" ON public.churches;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir igrejas" ON public.churches;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar igrejas" ON public.churches;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir igrejas" ON public.churches;

-- Criar novas políticas mais permissivas para churches
CREATE POLICY "Permitir todas operações para usuários autenticados - churches SELECT" 
  ON public.churches FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - churches INSERT" 
  ON public.churches FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - churches UPDATE" 
  ON public.churches FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir todas operações para usuários autenticados - churches DELETE" 
  ON public.churches FOR DELETE 
  USING (auth.uid() IS NOT NULL);
