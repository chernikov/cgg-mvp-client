'use client'
export const dynamic = 'force-dynamic';

import StepResultClient from './StepResultClient';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StepResultClient />
    </Suspense>
  );
} 