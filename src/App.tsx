
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MemberProvider } from "./context/MemberContext";
import { ChurchProvider } from "./context/ChurchContext";
import { IgrejaProvider } from "./context/IgrejaContext";
import { InventoryProvider } from "./context/InventoryContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { queryClient } from "./config/queryClient";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Members from "./pages/Members";
import MemberForm from "./pages/MemberForm";
import MemberCard from "./pages/MemberCard";
import MemberRecord from "./pages/MemberRecord";
import ChurchManagement from "./pages/ChurchManagement";
import ChurchForm from "./pages/ChurchForm";
import IgrejaForm from "./pages/IgrejaForm";
import Inventory from "./pages/Inventory";
import InventoryItemForm from "./pages/InventoryItemForm";
import InventoryMovement from "./pages/InventoryMovement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import GoogleSheetsIntegration from "./pages/GoogleSheetsIntegration";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ProtectedRoute>
              <MemberProvider>
                <ChurchProvider>
                  <IgrejaProvider>
                    <InventoryProvider>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        
                        {/* Rotas de Membros */}
                        <Route path="/membros" element={<Members />} />
                        <Route path="/membros/novo" element={<MemberForm />} />
                        <Route path="/membros/editar/:id" element={<MemberForm />} />
                        <Route path="/membros/carteirinha/:id" element={<MemberCard />} />
                        <Route path="/membros/ficha/:id" element={<MemberRecord />} />
                        
                        {/* Rotas de Igrejas */}
            <Route path="/igrejas" element={<ChurchManagement />} />
            <Route path="/igrejas/nova" element={<ChurchForm />} />
            <Route path="/igrejas/editar/:id" element={<ChurchForm />} />
            
            {/* Rotas de Igrejas Sistema (tabela igreja) */}
            <Route path="/igrejas/nova-igreja" element={<IgrejaForm />} />
          <Route path="/igrejas/editar-igreja/:id" element={<IgrejaForm />} />
                        
                        {/* Rotas de Inventário/Depósito */}
                        <Route path="/deposito" element={<Inventory />} />
                        <Route path="/deposito/item/novo" element={<InventoryItemForm />} />
                        <Route path="/deposito/item/editar/:id" element={<InventoryItemForm />} />
                        <Route path="/deposito/movimentacao/:type" element={<InventoryMovement />} />
                        
                        {/* Outras rotas */}
                        <Route path="/relatorios" element={<Reports />} />
                        <Route path="/configuracoes" element={<Settings />} />
                        <Route path="/integracao" element={<GoogleSheetsIntegration />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        
                        {/* Rota 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                     </InventoryProvider>
                   </IgrejaProvider>
                </ChurchProvider>
              </MemberProvider>
            </ProtectedRoute>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
