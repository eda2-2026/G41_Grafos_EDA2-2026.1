import { Flame } from 'lucide-react';
import type { SimulationIntensity } from '@/types';

interface SimulationSetupPanelProps {
  originName?: string;
  intensity: SimulationIntensity;
  blockedCount: number;
  canRun: boolean;
  isRunning: boolean;
  onIntensityChange: (intensity: SimulationIntensity) => void;
  onRun: () => void;
  onClearBlocks: () => void;
  onCancel: () => void;
}

const descriptions: Record<SimulationIntensity, string> = {
  LOW: 'Fumaça detectada, elevadores funcionam',
  MEDIUM: 'Incêndio localizado, evacuação preventiva',
  HIGH: 'Incêndio em expansão, elevadores desativados',
  CRITICAL: 'Perigo imediato, rotas mínimas disponíveis',
};

const intensityLabels: Record<SimulationIntensity, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

const intensityColors: Record<SimulationIntensity, string> = {
  LOW: 'text-amber-600',
  MEDIUM: 'text-orange-600',
  HIGH: 'text-red-600',
  CRITICAL: 'text-red-900',
};

export const SimulationSetupPanel = ({
  originName,
  intensity,
  blockedCount,
  canRun,
  isRunning,
  onIntensityChange,
  onRun,
  onClearBlocks,
  onCancel,
}: SimulationSetupPanelProps) => (
  <aside className="space-y-4 rounded-lg border border-border bg-white p-4 shadow-sm">
    <h2 className="text-lg font-bold">Configurar Simulação</h2>

    {/* Step 1 */}
    <section>
      <p className="text-sm font-semibold">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
        Origem do perigo
      </p>
      {originName ? (
        <p className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-sm font-semibold text-danger">
          <Flame size={14} /> {originName}
        </p>
      ) : (
        <p className="mt-1 text-sm text-slate-500">Clique no ambiente onde o perigo iniciou.</p>
      )}
    </section>

    {/* Step 2 */}
    <section>
      <p className="text-sm font-semibold">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>
        Intensidade
      </p>
      <div className="mt-2 space-y-2">
        {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SimulationIntensity[]).map((item) => (
          <button
            key={item}
            className={`w-full rounded-md border p-2.5 text-left text-sm ${
              intensity === item ? 'border-primary bg-blue-50' : 'border-border bg-white hover:bg-slate-50'
            }`}
            onClick={() => onIntensityChange(item)}
          >
            <strong className={intensity === item ? 'text-primary' : intensityColors[item]}>{intensityLabels[item]}</strong>
            <span className="block text-xs text-slate-500">{descriptions[item]}</span>
          </button>
        ))}
      </div>
    </section>

    {/* Step 3 */}
    <section>
      <p className="text-sm font-semibold">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">3</span>
        Bloqueios opcionais
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Clique em ambientes ou conexões para bloquear.
        <br />
        <span className="text-xs">Saídas de emergência não podem ser bloqueadas.</span>
      </p>
      {blockedCount > 0 && (
        <div className="mt-2 flex items-center justify-between rounded-md bg-slate-50 p-2">
          <span className="text-xs font-semibold text-slate-600">{blockedCount} item(s) bloqueado(s)</span>
          <button
            className="rounded px-2 py-1 text-xs font-bold text-danger hover:bg-red-50"
            onClick={onClearBlocks}
          >
            Limpar
          </button>
        </div>
      )}
    </section>

    {/* Scenario summary */}
    {canRun && (
      <div className="rounded-md border border-border bg-slate-50 p-3 text-xs text-slate-600">
        <p className="mb-1 font-bold text-slate-700">Resumo do cenário</p>
        <p>Origem: <strong>{originName}</strong></p>
        <p>Intensidade: <strong>{intensityLabels[intensity]}</strong></p>
        <p>Bloqueios: <strong>{blockedCount} item(s)</strong></p>
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2">
      <button
        disabled={!canRun || isRunning}
        className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        onClick={onRun}
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Calculando...
          </span>
        ) : (
          'Calcular Rotas'
        )}
      </button>
      <button
        className="rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-slate-50"
        onClick={onCancel}
        disabled={isRunning}
      >
        Cancelar
      </button>
    </div>
  </aside>
);
