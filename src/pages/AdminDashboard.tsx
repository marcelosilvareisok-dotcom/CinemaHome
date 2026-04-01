import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Database, Server, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

interface SystemHealth {
  status: string;
  uptime: string;
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
  };
  services: {
    database: string;
    tmdbApi: string;
    server: string;
  };
  issues: Array<{
    component: string;
    severity: string;
    message: string;
    fixAction: string;
  }>;
}

export default function AdminDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [repairing, setRepairing] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system-health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error("Erro ao buscar saúde do sistema:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const handleRepair = async (action: string) => {
    setRepairing(action);
    try {
      await fetch('/api/admin/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      await fetchHealth(); // Recarrega os dados após o reparo
    } catch (error) {
      console.error("Erro ao executar reparo:", error);
    } finally {
      setRepairing(null);
    }
  };

  if (loading && !health) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-red-600 w-8 h-8" />
              Painel Administrativo
            </h1>
            <p className="text-zinc-400 mt-1">Monitoramento de Segurança e Saúde do Sistema</p>
          </div>
          <button 
            onClick={fetchHealth}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </header>

        {health?.issues && health.issues.length > 0 && (
          <div className="mb-8 bg-red-950/30 border border-red-900/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6" />
              Atenção Requerida ({health.issues.length})
            </h2>
            <div className="space-y-4">
              {health.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start justify-between bg-black/40 p-4 rounded-md border border-red-900/30">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-red-400">{issue.component}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-200 uppercase tracking-wider">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-sm">{issue.message}</p>
                    <p className="text-zinc-500 text-xs mt-2">Ação sugerida: {issue.fixAction}</p>
                  </div>
                  <button 
                    onClick={() => handleRepair(`fix_${issue.component.toLowerCase().replace(' ', '_')}`)}
                    disabled={repairing !== null}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {repairing === `fix_${issue.component.toLowerCase().replace(' ', '_')}` ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Reparando...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Corrigir Agora</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Status do Servidor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                Servidor
              </h3>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="text-green-400 font-medium capitalize">{health?.services.server}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Uptime</span>
                <span className="text-zinc-300">{health?.uptime}</span>
              </div>
            </div>
          </div>

          {/* Banco de Dados */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Banco de Dados
              </h3>
              <div className={`w-3 h-3 rounded-full ${health?.services.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Conexão</span>
                <span className={health?.services.database === 'connected' ? 'text-green-400' : 'text-red-400'}>
                  {health?.services.database === 'connected' ? 'Estável' : 'Falha'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Provedor</span>
                <span className="text-zinc-300">Supabase</span>
              </div>
            </div>
          </div>

          {/* Uso de Memória */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Memória (RAM)
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Uso Atual (RSS)</span>
                <span className="text-zinc-300">{health?.memory.rss}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Heap Total</span>
                <span className="text-zinc-300">{health?.memory.heapTotal}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-zinc-300 mb-4 border-b border-zinc-800 pb-2">Ações Rápidas de Segurança</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => handleRepair('clear_cache')} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-left transition-colors">
              <RefreshCw className="w-5 h-5 text-zinc-400 mb-2" />
              <div className="font-medium text-sm">Limpar Cache</div>
              <div className="text-xs text-zinc-500 mt-1">Remove dados temporários</div>
            </button>
            <button onClick={() => handleRepair('rotate_keys')} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-left transition-colors">
              <ShieldCheck className="w-5 h-5 text-zinc-400 mb-2" />
              <div className="font-medium text-sm">Rotacionar Chaves</div>
              <div className="text-xs text-zinc-500 mt-1">Gera novos tokens JWT</div>
            </button>
            <button onClick={() => handleRepair('block_ips')} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-left transition-colors">
              <ShieldAlert className="w-5 h-5 text-zinc-400 mb-2" />
              <div className="font-medium text-sm">Bloquear IPs Suspeitos</div>
              <div className="text-xs text-zinc-500 mt-1">Atualiza firewall</div>
            </button>
            <button onClick={() => handleRepair('restart_services')} className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-left transition-colors border border-red-900/30">
              <Zap className="w-5 h-5 text-red-500 mb-2" />
              <div className="font-medium text-sm text-red-400">Reiniciar Serviços</div>
              <div className="text-xs text-zinc-500 mt-1">Downtime de ~5s</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
