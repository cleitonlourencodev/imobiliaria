'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  Zap, 
  Settings, 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Search, 
  Filter, 
  Save, 
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MapPin,
  Smartphone,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { formatCurrencyBRL } from '@/lib/whatsapp';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import ImageUploader from '@/components/ImageUploader';
import LocationPickerMap from '@/components/LocationPickerMap';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'brokers' | 'leads' | 'valuations' | 'settings'>('overview');

  // Authenticated State Simulation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginPassword, setLoginPassword] = useState('');

  // Data states
  const [properties, setProperties] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [valuations, setValuations] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Property Modal State
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<any | null>(null);

  // Broker Modal State
  const [brokerModalOpen, setBrokerModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState<any | null>(null);

  // Admin Search Filters
  const [propSearch, setPropSearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showAdminToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [pRes, bRes, lRes, vRes, sRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/brokers'),
        fetch('/api/leads'),
        fetch('/api/valuation'),
        fetch('/api/settings')
      ]);

      const [pData, bData, lData, vData, sData] = await Promise.all([
        pRes.json(), bRes.json(), lRes.json(), vRes.json(), sRes.json()
      ]);

      if (pData.success) setProperties(pData.data);
      if (bData.success) setBrokers(bData.data);
      if (lData.success) setLeads(lData.data);
      if (vData.success) setValuations(vData.data);
      if (sData.success) setSettings(sData.data);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadAllAdminData() {
      try {
        setLoading(true);
        const [pRes, bRes, lRes, vRes, sRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/brokers'),
          fetch('/api/leads'),
          fetch('/api/valuation'),
          fetch('/api/settings')
        ]);

        const [pData, bData, lData, vData, sData] = await Promise.all([
          pRes.json(), bRes.json(), lRes.json(), vRes.json(), sRes.json()
        ]);

        if (!cancelled) {
          if (pData.success) setProperties(pData.data);
          if (bData.success) setBrokers(bData.data);
          if (lData.success) setLeads(lData.data);
          if (vData.success) setValuations(vData.data);
          if (sData.success) setSettings(sData.data);
        }
      } catch (e) {
        if (!cancelled) console.error('Error loading admin data:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAllAdminData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Quick WhatsApp Direct Toggle Handler for individual Property
  const handleToggleWhatsappDirect = async (propId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappDirectEnabled: !currentVal })
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.map(p => p.id === propId ? { ...p, whatsappDirectEnabled: !currentVal } : p));
        showAdminToast(`WhatsApp Direto ${!currentVal ? 'ATIVADO' : 'DESATIVADO'} para este imóvel!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Property Handler
  const handleDeleteProperty = async (propId: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel do sistema?')) return;
    try {
      const res = await fetch(`/api/properties/${propId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.filter(p => p.id !== propId));
        showAdminToast('Imóvel excluído com sucesso.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Broker Handler
  const handleDeleteBroker = async (brokerId: string) => {
    if (!confirm('Tem certeza que deseja remover este corretor?')) return;
    try {
      const res = await fetch(`/api/brokers/${brokerId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBrokers(prev => prev.filter(b => b.id !== brokerId));
        showAdminToast('Corretor removido.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Lead Status Update Handler
  const handleLeadStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        showAdminToast('Status do lead atualizado!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save / Update Site Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        showAdminToast('Configurações globais salvas!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Properties
  const filteredProperties = properties.filter(p => {
    if (!propSearch) return true;
    const term = propSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.neighborhood.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term)
    );
  });

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    if (!leadSearch) return true;
    const term = leadSearch.toLowerCase();
    return (
      l.clientName.toLowerCase().includes(term) ||
      l.clientPhone.toLowerCase().includes(term) ||
      (l.property && l.property.title.toLowerCase().includes(term))
    );
  });

  // Metrics
  const totalProperties = properties.length;
  const activeWhatsAppDirectProps = properties.filter(p => p.whatsappDirectEnabled).length;
  const totalLeads = leads.length;
  const directWhatsappLeads = leads.filter(l => l.whatsappDirectTriggered).length;

  const leadChartData = [
    { name: 'WhatsApp Direto', val: directWhatsappLeads },
    { name: 'Visitas Agendadas', val: leads.filter(l => l.type === 'agendamento_visita').length },
    { name: 'Financiamento', val: leads.filter(l => l.type === 'simulacao_financiamento').length },
    { name: 'Geral', val: leads.filter(l => l.type === 'contato_geral').length },
  ];

  const categoryDistribution = [
    { name: 'Casas', value: properties.filter(p => p.category === 'casa').length, color: '#f59e0b' },
    { name: 'Apartamentos', value: properties.filter(p => p.category === 'apartamento').length, color: '#10b981' },
    { name: 'Terrenos', value: properties.filter(p => p.category === 'terreno').length, color: '#3b82f6' },
    { name: 'Coberturas', value: properties.filter(p => p.category === 'cobertura').length, color: '#8b5cf6' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Área Restrita do Sistema</h2>
            <p className="text-xs text-slate-400 mt-1">Digite a senha do sistema para gerenciar imóveis e corretores.</p>
          </div>
            <label htmlFor="admin-login-password" className="sr-only">Senha administrativa</label>
            <input
              id="admin-login-password"
              name="loginPassword"
              type="password"
              placeholder="Senha administrativa"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm text-center focus:border-amber-500 focus:outline-none"
            />
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Acessar Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-amber-500/20">
              P
            </div>
            <span className="text-lg font-black text-white tracking-wider">
              PRIME <span className="text-amber-400">SISTEMA</span>
            </span>
          </Link>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            • Gestão Imobiliária & Direcionamento WhatsApp
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllAdminData}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400"
            title="Atualizar dados do sistema"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-semibold text-xs hover:text-white flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Site Público</span>
          </Link>
        </div>
      </header>

      {/* Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-4 space-y-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Visão Geral & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'properties' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>Gerenciar Imóveis</span>
            </span>
            <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {totalProperties}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brokers')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'brokers' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Corretores</span>
            </span>
            <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {brokers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'leads' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Leads & CRM</span>
            </span>
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {totalLeads}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('valuations')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all ${
              activeTab === 'valuations' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>Solicitações Avaliação</span>
            </span>
            <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {valuations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações do Site</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-x-hidden">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-black text-white">Painel Geral de Desempenho</h1>
                <p className="text-xs text-slate-400">Visão consolidada de anúncios, roteamento WhatsApp e captação de leads.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total de Imóveis</span>
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">{totalProperties}</div>
                  <div className="text-[11px] text-slate-400">Cadastrados no catálogo</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                    <span>WhatsApp Direto Ativo</span>
                    <Zap className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">{activeWhatsAppDirectProps}</div>
                  <div className="text-[11px] text-slate-400">Imóveis direcionando ao corretor</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total de Leads (CRM)</span>
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">{totalLeads}</div>
                  <div className="text-[11px] text-slate-400">{directWhatsappLeads} via WhatsApp direto</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Corretores Ativos</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">{brokers.length}</div>
                  <div className="text-[11px] text-slate-400">Com registro CRECI</div>
                </div>
              </div>

              {/* Chart & Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Origem dos Atendimentos (Leads)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Bar dataKey="val" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Distribuição do Catálogo
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {categoryDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 font-medium">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Gerenciador de Imóveis</h1>
                  <p className="text-xs text-slate-400">Ative ou desative o WhatsApp Direto por imóvel individualmente.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProp(null);
                    setPropertyModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Imóvel</span>
                </button>
              </div>

              {/* Search Filter for Table */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  id="prop-search"
                  name="propSearch"
                  type="text"
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  placeholder="Filtrar por código, título ou bairro..."
                  aria-label="Filtrar imóveis"
                  className="bg-transparent border-none text-white text-xs w-full focus:outline-none"
                />
              </div>

              {/* Properties Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Imóvel</th>
                        <th className="p-4">Tipo / Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Corretor Responsável</th>
                        <th className="p-4">WhatsApp Direto (PROMPT TOGGLE)</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {filteredProperties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-950/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={prop.coverImage}
                              alt={prop.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{prop.title}</div>
                              <span className="text-[10px] text-amber-400 font-mono">Ref: {prop.code}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold uppercase">
                              {prop.type} • {prop.category}
                            </span>
                          </td>

                          <td className="p-4 font-black text-amber-400 font-mono">
                            {formatCurrencyBRL(prop.price)}
                          </td>

                          <td className="p-4">
                            {prop.broker ? (
                              <div className="flex items-center gap-2">
                                <img src={prop.broker.photoUrl} alt={prop.broker.name} className="w-6 h-6 rounded-full object-cover" />
                                <div>
                                  <div className="font-bold text-white text-[11px]">{prop.broker.name}</div>
                                  <div className="text-[9px] text-slate-400 font-mono">{prop.broker.creci}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Sem corretor</span>
                            )}
                          </td>

                          {/* WHATSAPP DIRECT TOGGLE SWITCH (INDIVIDUAL OPTION PER PROPERTY) */}
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleWhatsappDirect(prop.id, prop.whatsappDirectEnabled)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                                prop.whatsappDirectEnabled 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md' 
                                  : 'bg-slate-950 text-slate-500 border border-slate-800'
                              }`}
                            >
                              <Zap className={`w-3.5 h-3.5 ${prop.whatsappDirectEnabled ? 'fill-emerald-400 animate-pulse' : ''}`} />
                              <span>{prop.whatsappDirectEnabled ? 'ATIVO (Corretor)' : 'DESATIVADO (Central)'}</span>
                            </button>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProp(prop);
                                setPropertyModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProperty(prop.id)}
                              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-rose-400"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BROKERS MANAGEMENT */}
          {activeTab === 'brokers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white">Gerenciador de Corretores</h1>
                  <p className="text-xs text-slate-400">Cadastre e gerencie a equipe de consultores e seus números do WhatsApp.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingBroker(null);
                    setBrokerModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Corretor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brokers.map((broker) => (
                  <div key={broker.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <img src={broker.photoUrl} alt={broker.name} className="w-14 h-14 rounded-2xl object-cover border border-amber-500 shrink-0" />
                          <div>
                            <h3 className="font-bold text-white text-sm">{broker.name}</h3>
                            <span className="text-xs font-mono text-amber-400 font-bold">{broker.creci}</span>
                            <div className="text-[11px] text-slate-400 mt-0.5">{broker.email}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteBroker(broker.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400 text-[10px]">WhatsApp Cadastrado para Recebimento de Leads:</div>
                        <div className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" /> {broker.whatsapp}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBroker(broker);
                        setBrokerModalOpen(true);
                      }}
                      className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-400 text-xs font-bold rounded-xl"
                    >
                      Editar Dados do Corretor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">Atendimentos & Leads CRM</h1>
                  <p className="text-xs text-slate-400">Acompanhe todas as manifestações de interesse dos clientes.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400 ml-2" />
                  <input
                    id="lead-search"
                    name="leadSearch"
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Buscar cliente..."
                    aria-label="Buscar leads"
                    className="bg-transparent border-none text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Imóvel Solicitado</th>
                        <th className="p-4">Tipo Lead</th>
                        <th className="p-4">Status Atendimento</th>
                        <th className="p-4">Corretor</th>
                        <th className="p-4 text-right">Ação WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-950/50">
                          <td className="p-4">
                            <div className="font-bold text-white">{lead.clientName}</div>
                            <div className="text-[11px] text-slate-400">{lead.clientPhone}</div>
                          </td>

                          <td className="p-4">
                            {lead.property ? (
                              <div>
                                <div className="font-bold text-white text-[11px]">{lead.property.title}</div>
                                <span className="text-[10px] text-amber-400 font-mono">Ref: {lead.property.code}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">Contato Geral</span>
                            )}
                          </td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded bg-slate-950 text-amber-400 font-mono text-[10px] font-bold border border-slate-800">
                              {lead.type}
                            </span>
                          </td>

                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-1 text-xs"
                            >
                              <option value="novo">Novo Lead</option>
                              <option value="em_atendimento">Em Atendimento</option>
                              <option value="visita_agendada">Visita Agendada</option>
                              <option value="proposta">Proposta Enviada</option>
                              <option value="fechado">Fechado / Ganho</option>
                              <option value="perdido">Perdido</option>
                            </select>
                          </td>

                          <td className="p-4 text-xs font-semibold text-slate-300">
                            {lead.broker ? lead.broker.name : 'Central Agência'}
                          </td>

                          <td className="p-4 text-right">
                            <a
                              href={`https://wa.me/55${lead.clientPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(lead.clientName)}!%20Sou%20o%20corretor%20da%20Prime%20Im%C3%B3veis%20e%20vi%20seu%20interesse%20no%20im%C3%B3vel.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                            >
                               <WhatsappIcon className="w-3.5 h-3.5 fill-white" />
                              <span>Iniciar Chat</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VALUATION REQUESTS */}
          {activeTab === 'valuations' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white">Solicitações de Avaliação de Imóvel</h1>
                <p className="text-xs text-slate-400">Proprietários solicitando estimativas de venda/locação.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {valuations.map((val) => (
                  <div key={val.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white">{val.ownerName}</h3>
                        <span className="text-xs text-slate-400">{val.ownerPhone} • {val.ownerEmail}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                        {val.intent}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong>Tipo:</strong> {val.propertyType} — {val.estimatedArea} m² ({val.bedrooms} quartos)</p>
                      <p><strong>Local:</strong> {val.neighborhood}, {val.city}</p>
                      <p><strong>Valor Estimado:</strong> <span className="text-emerald-400 font-mono font-bold">{formatCurrencyBRL(val.estimatedValue)}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 max-w-3xl">
              <div>
                <h1 className="text-xl font-black text-white">Configurações Globais do Site</h1>
                <p className="text-xs text-slate-400">Informações institucionais e WhatsApp padrão de transbordo.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="settings-agencyName" className="text-xs font-semibold text-slate-300">Nome da Imobiliária</label>
                  <input
                    id="settings-agencyName"
                    name="agencyName"
                    type="text"
                    value={settings.agencyName || ''}
                    onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="settings-creci" className="text-xs font-semibold text-slate-300">CRECI da Agência</label>
                  <input
                    id="settings-creci"
                    name="creci"
                    type="text"
                    value={settings.creci || ''}
                    onChange={(e) => setSettings({ ...settings, creci: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="settings-whatsappDefault" className="text-xs font-semibold text-slate-300">WhatsApp Padrão da Agência (Backup)</label>
                  <input
                    id="settings-whatsappDefault"
                    name="whatsappDefault"
                    type="text"
                    value={settings.whatsappDefault || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappDefault: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="settings-phone" className="text-xs font-semibold text-slate-300">Telefone Fixo</label>
                  <input
                    id="settings-phone"
                    name="phone"
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <h3 className="text-xs font-bold text-slate-200 mt-2 mb-2">Redes Sociais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="settings-socialInstagram" className="text-xs font-semibold text-slate-300">Instagram</label>
                      <input
                        id="settings-socialInstagram"
                        name="socialInstagram"
                        type="text"
                        value={settings.socialInstagram || ''}
                        onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                        placeholder="https://instagram.com/suaempresa"
                      />
                    </div>
                    <div>
                      <label htmlFor="settings-socialFacebook" className="text-xs font-semibold text-slate-300">Facebook</label>
                      <input
                        id="settings-socialFacebook"
                        name="socialFacebook"
                        type="text"
                        value={settings.socialFacebook || ''}
                        onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                        placeholder="https://facebook.com/suaempresa"
                      />
                    </div>
                    <div>
                      <label htmlFor="settings-socialYoutube" className="text-xs font-semibold text-slate-300">YouTube</label>
                      <input
                        id="settings-socialYoutube"
                        name="socialYoutube"
                        type="text"
                        value={settings.socialYoutube || ''}
                        onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                        placeholder="https://youtube.com/@suaempresa"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </form>
          )}

        </main>
      </div>

      {/* CREATE / EDIT PROPERTY MODAL */}
      {propertyModalOpen && (
        <PropertyModal
          property={editingProp}
          brokers={brokers}
          onClose={() => setPropertyModalOpen(false)}
          onSaved={() => {
            setPropertyModalOpen(false);
            loadAllAdminData();
            showAdminToast('Imóvel salvo com sucesso!');
          }}
        />
      )}

      {/* CREATE / EDIT BROKER MODAL */}
      {brokerModalOpen && (
        <BrokerModal
          broker={editingBroker}
          onClose={() => setBrokerModalOpen(false)}
          onSaved={() => {
            setBrokerModalOpen(false);
            loadAllAdminData();
            showAdminToast('Corretor salvo com sucesso!');
          }}
        />
      )}
    </div>
  );
}

{/* Property Modal Component */}
function PropertyModal({ property, brokers, onClose, onSaved }: { property: any; brokers: any[]; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    code: property?.code || '',
    type: property?.type || 'venda',
    category: property?.category || 'casa',
    price: property?.price || '1500000',
    condoFee: property?.condoFee || '1000',
    iptu: property?.iptu || '400',
    bedrooms: property?.bedrooms || 3,
    suites: property?.suites || 2,
    bathrooms: property?.bathrooms || 3,
    parkingSpaces: property?.parkingSpaces || 2,
    totalArea: property?.totalArea || 250,
    builtArea: property?.builtArea || 200,
    address: property?.address || '',
    neighborhood: property?.neighborhood || '',
    city: property?.city || 'São Paulo',
    state: property?.state || 'SP',
    description: property?.description || '',
    whatsappDirectEnabled: property ? property.whatsappDirectEnabled : true,
    brokerId: property?.brokerId || (brokers[0]?.id || ''),
    coverImage: property?.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    images: property?.images || [property?.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'],
    featured: property ? property.featured : false,
    amenities: property?.amenities || ['Piscina', 'Área Gourmet', 'Portaria 24h'],
    latitude: property?.latitude || '',
    longitude: property?.longitude || '',
    locationLink: property?.locationLink || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = property ? `/api/properties/${property.id}` : '/api/properties';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {property ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-prop-title" className="font-semibold text-slate-300">Título do Imóvel *</label>
              <input
                id="admin-prop-title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              />
            </div>

            <div>
              <label htmlFor="admin-prop-code" className="font-semibold text-slate-300">Código Referência *</label>
              <input
                id="admin-prop-code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1 font-mono"
              />
            </div>

            <div>
              <label htmlFor="admin-prop-type" className="font-semibold text-slate-300">Tipo (Modalidade)</label>
              <select
                id="admin-prop-type"
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
                <option value="ambos">Venda & Aluguel</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-prop-category" className="font-semibold text-slate-300">Categoria</label>
              <select
                id="admin-prop-category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              >
                <option value="casa">Casa / Sobrado</option>
                <option value="terreno">Terreno / Lote</option>
                <option value="apartamento">Apartamento</option>
                <option value="cobertura">Cobertura</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>

            <div>
              <label htmlFor="admin-prop-price" className="font-semibold text-slate-300">Preço (R$) *</label>
              <input
                id="admin-prop-price"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold rounded-xl px-3.5 py-2.5 mt-1"
              />
            </div>

            {/* CORRETOR RESPONSÁVEL SELECTION */}
            <div>
              <label htmlFor="admin-prop-broker" className="font-semibold text-slate-300">Corretor Responsável *</label>
              <select
                id="admin-prop-broker"
                name="brokerId"
                value={formData.brokerId}
                onChange={(e) => setFormData({ ...formData, brokerId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              >
                <option value="">Selecione o corretor...</option>
                {brokers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.creci})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LOCATION REGISTRATION SECTION: Link, Coordinates, and Pin on Map */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/20 space-y-4">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Cadastro de Localização do Imóvel
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cadastre a localização por qualquer um dos meios abaixo: link direto do Google Maps, coordenadas GPS, ou clicando no alfinete no mapa abaixo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Link de Localização */}
              <div>
                <label htmlFor="admin-prop-locationLink" className="font-semibold text-slate-300 text-[11px]">Link de Localização (Google Maps)</label>
                <input
                  id="admin-prop-locationLink"
                  name="locationLink"
                  type="text"
                  placeholder="https://goo.gl/maps/..."
                  value={(formData as any).locationLink || ''}
                  onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs mt-1"
                />
              </div>

              {/* Coordenadas */}
              <div>
                <label htmlFor="admin-prop-latitude" className="font-semibold text-slate-300 text-[11px]">Latitude (coordenada Y)</label>
                <input
                  id="admin-prop-latitude"
                  name="latitude"
                  type="text"
                  placeholder="Ex: -23.5505"
                  value={(formData as any).latitude || ''}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs mt-1 font-mono"
                />
              </div>
              <div>
                <label htmlFor="admin-prop-longitude" className="font-semibold text-slate-300 text-[11px]">Longitude (coordenada X)</label>
                <input
                  id="admin-prop-longitude"
                  name="longitude"
                  type="text"
                  placeholder="Ex: -46.6333"
                  value={(formData as any).longitude || ''}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs mt-1 font-mono"
                />
              </div>
            </div>

            {/* Inserção de Alfinete no Mapa (Small Interactive Map in Modal) */}
            <div>
              <label className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" /> Mapa Interativo para Cadastro de Localização
              </label>
              <div className="mt-2">
                <LocationPickerMap
                  latitude={(formData as any).latitude}
                  longitude={(formData as any).longitude}
                  onLocationChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                  onSearchAddress={(address) => {
                    setFormData({ ...formData, locationLink: address });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Component */}
          <ImageUploader
            images={Array.isArray((formData as any).images) ? (formData as any).images : [(formData as any).coverImage || '']}
            coverImage={(formData as any).coverImage || ''}
            onCoverChange={(url: string) => setFormData({ ...formData, coverImage: url })}
            onChange={(imgs: string[]) => setFormData({ ...formData, images: imgs })}
          />

          {/* WHATSAPP DIRECT TOGGLE OPTION (CRITICAL PROMPT REQUIREMENT) */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-2">
                <Zap className="w-4 h-4 fill-emerald-400" />
                Atendimento Direto no WhatsApp do Corretor
              </span>
              <input
                type="checkbox"
                checked={formData.whatsappDirectEnabled}
                onChange={(e) => setFormData({ ...formData, whatsappDirectEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Quando esta opção estiver <strong className="text-white">ativada</strong>, ao internauta cliente manifestar interesse por este imóvel, o corretor responsável selecionado acima receberá automaticamente em seu WhatsApp os dados completos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="admin-prop-bedrooms" className="font-semibold text-slate-300">Quartos</label>
              <input
                id="admin-prop-bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="admin-prop-suites" className="font-semibold text-slate-300">Suítes</label>
              <input
                id="admin-prop-suites"
                name="suites"
                type="number"
                value={formData.suites}
                onChange={(e) => setFormData({ ...formData, suites: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="admin-prop-bathrooms" className="font-semibold text-slate-300">Banheiros</label>
              <input
                id="admin-prop-bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="admin-prop-parking" className="font-semibold text-slate-300">Vagas</label>
              <input
                id="admin-prop-parking"
                name="parkingSpaces"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-300">Bairro</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300">Cidade</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-prop-coverImage" className="font-semibold text-slate-300">URL da Imagem de Capa</label>
            <input
              id="admin-prop-coverImage"
              name="coverImage"
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
            />
          </div>

          <div>
            <label htmlFor="admin-prop-description" className="font-semibold text-slate-300">Descrição Completa</label>
            <textarea
              id="admin-prop-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition-all"
          >
            {saving ? 'Salvando...' : 'Salvar Imóvel'}
          </button>
        </form>
      </div>
    </div>
  );
}

{/* Broker Modal Component */}
function BrokerModal({ broker, onClose, onSaved }: { broker: any; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState({
    name: broker?.name || '',
    creci: broker?.creci || '',
    email: broker?.email || '',
    phone: broker?.phone || '',
    whatsapp: broker?.whatsapp || '55119',
    photoUrl: broker?.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    bio: broker?.bio || '',
    specialties: broker?.specialties ? broker.specialties.join(', ') : 'Residencial, Alto Padrão'
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const url = broker ? `/api/brokers/${broker.id}` : '/api/brokers';
      const method = broker ? 'PUT' : 'POST';

      const specsArray = formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specialties: specsArray
        })
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {broker ? 'Editar Corretor' : 'Cadastrar Novo Corretor'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label htmlFor="broker-name" className="font-semibold text-slate-300">Nome do Corretor *</label>
            <input
              id="broker-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 mt-1"
            />
          </div>

          <div>
            <label htmlFor="broker-creci" className="font-semibold text-slate-300">CRECI *</label>
            <input
              id="broker-creci"
              name="creci"
              type="text"
              required
              value={formData.creci}
              onChange={(e) => setFormData({ ...formData, creci: e.target.value })}
              placeholder="CRECI 123.456-F"
              className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold rounded-xl px-3.5 py-2.5 mt-1"
            />
          </div>

          <div>
            <label htmlFor="broker-whatsapp" className="font-semibold text-slate-300">WhatsApp para Receber Leads (com DDD ex: 5511999998888) *</label>
            <input
              id="broker-whatsapp"
              name="whatsapp"
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold rounded-xl px-3.5 py-2.5 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="broker-email" className="font-semibold text-slate-300">E-mail</label>
              <input
                id="broker-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label htmlFor="broker-phone" className="font-semibold text-slate-300">Telefone Exibição</label>
              <input
                id="broker-phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="broker-photoUrl" className="font-semibold text-slate-300">URL da Foto de Perfil</label>
            <input
              id="broker-photoUrl"
              name="photoUrl"
              type="text"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="broker-specialties" className="font-semibold text-slate-300">Especialidades (separadas por vírgula)</label>
            <input
              id="broker-specialties"
              name="specialties"
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="broker-bio" className="font-semibold text-slate-300">Bio / Mini Perfil</label>
            <textarea
              id="broker-bio"
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl transition-all"
          >
            {saving ? 'Salvando...' : 'Salvar Corretor'}
          </button>
        </form>
      </div>
    </div>
  );
}
