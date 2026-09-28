import { useState } from 'react';

export function useDemoMode() {
  const [isDemo] = useState(import.meta.env.VITE_DEMO_MODE !== 'false');
  return { isDemo };
}