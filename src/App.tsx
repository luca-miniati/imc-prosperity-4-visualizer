import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/code-highlight/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { BasePage } from './pages/base/BasePage.tsx';
import { HomePage } from './pages/home/HomePage.tsx';
import { VisualizerPage } from './pages/visualizer/VisualizerPage.tsx';
import { useStore } from './store.ts';

export const theme = createTheme({
  colors: {
    dark: [
      '#D4D4D4',
      '#bfbfbf',
      '#a6a6a6',
      '#8c8c8c',
      '#353535',
      '#2d2d2d',
      '#2D2D2D',
      '#252526',
      '#1E1E1E',
      '#151515',
    ],
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BasePage />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/visualizer" element={<VisualizerPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>,
  ),
  {
    basename: '/imc-prosperity-4-visualizer/',
  },
);

export function App(): ReactNode {
  const colorScheme = useStore(state => state.colorScheme);

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
