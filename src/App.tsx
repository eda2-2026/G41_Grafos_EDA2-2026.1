import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { BuildingFormPage } from '@/features/buildings/BuildingFormPage';
import { EditorPage } from '@/features/editor/EditorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'buildings/new', element: <BuildingFormPage /> },
      { path: 'buildings/:buildingId/floors/:floorId', element: <EditorPage /> },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
