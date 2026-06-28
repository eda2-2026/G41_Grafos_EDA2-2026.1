import type { SimulationResult } from '@/types';
import { formatSeconds } from '@/utils/format';

export const RouteList = ({ result }: { result: SimulationResult }) => (
  <div className="mt-4 max-h-72 space-y-4 overflow-auto">
    {result.primaryRoutes.length > 0 && (
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Rotas Principais
        </h3>
        <div className="space-y-2">
          {result.primaryRoutes.map((route) => (
            <article
              key={`p-${route.originEnvironmentId}`}
              className="rounded-md border-l-4 border-success bg-green-50 p-3"
            >
              <p className="text-sm font-semibold text-success">
                {route.pathNames[0]} → {route.pathNames[route.pathNames.length - 1]}
              </p>
              <p className="mt-1 text-xs text-slate-500">{route.pathNames.join(' → ')}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                {formatSeconds(route.timeSeconds)} · {route.distanceMeters}m ·{' '}
                {route.peopleCount} pessoa(s)
                {route.pcdPeopleCount > 0 ? ` (${route.pcdPeopleCount} PCD)` : ''}
              </p>
            </article>
          ))}
        </div>
      </div>
    )}

    {result.alternativeRoutes.length > 0 && (
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Rotas Alternativas
        </h3>
        <div className="space-y-2">
          {result.alternativeRoutes.map((route) => (
            <article
              key={`a-${route.originEnvironmentId}`}
              className="rounded-md border-l-4 border-warning bg-amber-50 p-3"
            >
              <p className="text-sm font-semibold text-warning">
                {route.pathNames[0]} → {route.pathNames[route.pathNames.length - 1]}
              </p>
              <p className="mt-1 text-xs text-slate-500">{route.pathNames.join(' → ')}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                {formatSeconds(route.timeSeconds)} · {route.distanceMeters}m ·{' '}
                {route.peopleCount} pessoa(s)
              </p>
            </article>
          ))}
        </div>
      </div>
    )}

    {result.primaryRoutes.length === 0 && (
      <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-danger">
        Nenhuma rota de evacuação foi encontrada para este cenário.
      </p>
    )}
  </div>
);
