import { createMemoryRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import HomePage from '@/features/projects/pages/HomePage';
import ImportPage from '@/features/projects/pages/ImportPage';
import TypePage from '@/features/projects/pages/TypePage';
import UnderstandingPage from '@/features/projects/pages/UnderstandingPage';
import ConfigPage from '@/features/projects/pages/ConfigPage';
import ProgressPage from '@/features/projects/pages/ProgressPage';
import WorkbenchPage from '@/features/projects/pages/WorkbenchPage';
import PreviewTweakPage from '@/features/projects/pages/PreviewTweakPage';
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
        { path: 'understanding', element: <UnderstandingPage /> },
        { path: 'config', element: <ConfigPage /> },
        { path: 'progress', element: <ProgressPage /> },
        { path: 'workbench', element: <WorkbenchPage /> },
        { path: 'preview', element: <PreviewTweakPage /> },
        { path: 'export', element: <ExportPage /> },
        { path: 'settings', element: <SettingsPage /> }
      ]
    }
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
);
