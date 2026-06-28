import { Bath, DoorOpen, Hospital, Landmark, Layers, LocateFixed, Users } from 'lucide-react';
import type { Environment, EnvironmentType } from '@/types';

interface EnvironmentNodeProps {
  environment: Environment;
  selected?: boolean;
  blocked?: boolean;
  primary?: boolean;
  alternative?: boolean;
  inaccessible?: boolean;
  activeExit?: boolean;
  isConnectionStart?: boolean;
  onPointerDown?: (event: React.PointerEvent<SVGGElement>) => void;
  onClick?: () => void;
}

const colors: Record<EnvironmentType, { fill: string; stroke: string }> = {
  ROOM: { fill: '#DBEAFE', stroke: '#2563EB' },
  CORRIDOR: { fill: '#F1F5F9', stroke: '#94A3B8' },
  STAIRCASE: { fill: '#EDE9FE', stroke: '#7C3AED' },
  ELEVATOR: { fill: '#FEF3C7', stroke: '#D97706' },
  BATHROOM: { fill: '#F0FDFA', stroke: '#0D9488' },
  EMERGENCY_EXIT: { fill: '#DCFCE7', stroke: '#16A34A' },
  MEETING_POINT: { fill: '#E0F2FE', stroke: '#0284C7' },
};

const iconByType: Record<EnvironmentType, React.ElementType> = {
  ROOM: Users,
  CORRIDOR: LocateFixed,
  STAIRCASE: Layers,
  ELEVATOR: Landmark,
  BATHROOM: Bath,
  EMERGENCY_EXIT: DoorOpen,
  MEETING_POINT: Hospital,
};

export const EnvironmentNode = ({
  environment,
  selected,
  blocked,
  primary,
  alternative,
  inaccessible,
  activeExit,
  isConnectionStart,
  onPointerDown,
  onClick,
}: EnvironmentNodeProps) => {
  const base = colors[environment.type];
  const fill = blocked ? '#FEE2E2' : primary ? '#DCFCE7' : alternative ? '#FEF3C7' : inaccessible ? '#F1F5F9' : base.fill;
  const stroke = blocked ? '#DC2626' : primary ? '#16A34A' : alternative ? '#D97706' : inaccessible ? '#CBD5E1' : base.stroke;
  const Icon = iconByType[environment.type];
  const people = environment.occupancy.regular + environment.occupancy.pcd;

  return (
    <g
      transform={`translate(${environment.position.x} ${environment.position.y})`}
      onPointerDown={onPointerDown}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      opacity={inaccessible ? 0.65 : 1}
      className={[activeExit ? 'exit-active' : '', isConnectionStart ? 'connection-start' : ''].filter(Boolean).join(' ') || undefined}
      style={{ cursor: 'pointer' }}
      data-testid={`environment-${environment.type}`}
    >
      <rect
        width="150"
        height="78"
        rx="8"
        fill={fill}
        stroke={selected ? '#0F172A' : stroke}
        strokeWidth={selected ? 3 : 2}
        strokeDasharray={isConnectionStart ? '6 3' : undefined}
        filter={selected ? 'drop-shadow(0 8px 12px rgba(15, 23, 42, 0.18))' : undefined}
      />
      <foreignObject x="12" y="10" width="20" height="20">
        <Icon size={18} color={stroke} />
      </foreignObject>
      <text x="75" y="35" textAnchor="middle" className="fill-slate-950 text-sm font-semibold">
        {environment.name.length > 18 ? `${environment.name.slice(0, 17)}...` : environment.name}
      </text>
      <text x="75" y="56" textAnchor="middle" className="fill-slate-600 text-xs font-medium">
        {people} pessoas | cap. {environment.capacity}
      </text>
    </g>
  );
};
