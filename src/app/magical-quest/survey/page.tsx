'use client'
export const dynamic = 'force-dynamic';

import SurveyClient from './SurveyClient'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyClient />
    </Suspense>
  );
} 