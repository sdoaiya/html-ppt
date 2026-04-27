import { createMemoryRouter } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import HomePage from '@/features/projects/pages/HomePage';
import ImportPage from '@/features/projects/pages/ImportPage';
import UnderstandingPage from '@/features/projects/pages/UnderstandingPage';
import StructurePage from '@/features/projects/pages/StructurePage';
import WorkbenchPage from '@/features/projects/pages/WorkbenchPage';
import ExportPage from '@/features/projects/pages/ExportPage';

export const router = createMemoryRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'import', element: <ImportPage /> },
        { path: 'understanding', element: <UnderstandingPage /> },
        { path: 'structure', element: <StructurePage /> },
        { path: 'workbench', element: <WorkbenchPage /> },
        { path: 'export', element: <ExportPage /> }
      ]
    }
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
);
