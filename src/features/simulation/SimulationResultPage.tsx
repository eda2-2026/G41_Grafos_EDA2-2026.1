import { AlertTriangle } from 'lucide-react';
import type { Building, Floor, SimulationResult } from '@/types';
import { MetricsPanel } from './MetricsPanel';
import { RouteList } from './RouteList';

interface Props {
  result: SimulationResult;
  building: Building;
  floor: Floor;
  onSave: () => void;
  onPdf: () => void;
  onNew: () => void;
}

export const SimulationResultPage = ({ result, building, floor, onPdf, onNew }: Props) => {
  const status =
    result.coveragePercentage === 100
      ? 'Evacuação Completa'
      : result.coveragePercentage > 0
        ? 'Evacuação Parcial'
        : 'Evacuação Impossível';

  const statusColor =
    result.coveragePercentage === 100
      ? 'text-success'
      : result.coveragePercentage > 0
        ? 'text-warning'
        : 'text-danger';

  return (
    <aside className="space-y-4 rounded-lg border border-border bg-white p-4 shadow-sm">
      <div>
        <h2 className={`text-lg font-bold ${statusColor}`}>{status}</h2>
        <p className="text-sm text-slate-500">
          {building.name} · {floor.name}
        </p>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap gap-2 rounded-md bg-slate-50 p-3 text-xs font-semibold">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded bg-danger" /> Perigo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded bg-success" /> Rota principal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded bg-warning" /> Alternativa
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded border-2 border-primary bg-white" /> Saída ativa
        </span>
      </div>

      {/* Actions */}
      <div className="grid gap-2">
        <button
          className="rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors"
          onClick={onPdf}
        >
          Gerar PDF
        </button>
        <button
          className="rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors"
          onClick={onNew}
        >
          Nova Simulação
        </button>
      </div>

      {/* Metrics */}
      <MetricsPanel result={result} floor={floor} />

      {/* Routes */}
      <RouteList result={result} />

      {/* Inaccessible areas */}
      {result.inaccessibleEnvironmentIds.length > 0 && (
        <section className="rounded-md border border-danger bg-red-50 p-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-danger">
            <AlertTriangle size={15} /> {result.inaccessibleEnvironmentIds.length} área(s) sem rota de saída
          </h3>
          <ul className="mt-2 space-y-1">
            {result.inaccessibleEnvironmentIds.map((id) => {
              const env = floor.environments.find((item) => item.id === id);
              const people = env ? env.occupancy.regular + env.occupancy.pcd : 0;
              return (
                <li key={id} className="text-xs text-danger">
                  {env?.name ?? id}
                  {people > 0 ? ` — ${people} pessoa(s) em risco` : ''}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </aside>
  );
};
