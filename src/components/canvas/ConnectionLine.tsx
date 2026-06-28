import type { Connection, Environment, Route } from '@/types';

interface ConnectionLineProps {
  connection: Connection;
  environments: Environment[];
  selected?: boolean;
  blocked?: boolean;
  primaryRoutes?: Route[];
  alternativeRoutes?: Route[];
  onClick?: () => void;
}

const center = (environment: Environment) => ({ x: environment.position.x + 75, y: environment.position.y + 39 });

const routeIncludesConnection = (routes: Route[], connection: Connection): boolean =>
  routes.some((route) =>
    route.path.some((id, index) => {
      const next = route.path[index + 1];
      return (
        next &&
        ((connection.fromEnvironmentId === id && connection.toEnvironmentId === next) ||
          (connection.toEnvironmentId === id && connection.fromEnvironmentId === next))
      );
    }),
  );

export const ConnectionLine = ({
  connection,
  environments,
  selected,
  blocked,
  primaryRoutes = [],
  alternativeRoutes = [],
  onClick,
}: ConnectionLineProps) => {
  const from = environments.find((environment) => environment.id === connection.fromEnvironmentId);
  const to = environments.find((environment) => environment.id === connection.toEnvironmentId);
  if (!from || !to) return null;

  const start = center(from);
  const end = center(to);
  const primary = routeIncludesConnection(primaryRoutes, connection);
  const alternative = routeIncludesConnection(alternativeRoutes, connection);
  const stroke = blocked ? '#DC2626' : primary ? '#16A34A' : alternative ? '#D97706' : selected ? '#0F172A' : '#94A3B8';
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  return (
    <g onClick={(event) => { event.stopPropagation(); onClick?.(); }} style={{ cursor: 'pointer' }}>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={stroke}
        strokeWidth={primary ? 7 : selected ? 5 : 4}
        strokeLinecap="round"
        className={primary ? 'route-primary' : undefined}
        strokeDasharray={alternative ? '9 8' : undefined}
      />
      <rect x={midX - 25} y={midY - 12} width="50" height="24" rx="6" fill="white" stroke="#E2E8F0" />
      <text x={midX} y={midY + 4} textAnchor="middle" className="fill-slate-600 text-xs font-semibold">
        {blocked ? 'Bloq.' : `${connection.distanceMeters}m`}
      </text>
    </g>
  );
};
