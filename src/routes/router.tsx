import { createMemoryRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import HomePage from '@/features/projects/pages/HomePage';
import ImportPage from '@/features/projects/pages/ImportPage';
import TypePage from '@/features/projects/pages/TypePage';
import ConfigPage from '@/features/projects/pages/ConfigPage';
import WorkbenchPage from '@/features/projects/pages/WorkbenchPage';
import ExportPage from '@/features/projects/pages/ExportPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';

export const router = createMemoryRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'import', element: <ImportPage /> },
        { path: 'type', element: <TypePage /> },
        { path: 'config', element: <ConfigPage /> },
        { path: 'workbench', element: <WorkbenchPage /> },
        { path: 'export', element: <ExportPage /> },
        { path: 'settings', element: <SettingsPage /> }
      ]
    }
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
);
