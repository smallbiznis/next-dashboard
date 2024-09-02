'use client';

import { Suspense, useEffect, useState } from 'react';
import { Page } from '@/components/page';
import Loading from './loading';
import { IApplication } from '@/types/application';
import { faro } from '@grafana/faro-web-sdk';

export default function Application({ params }: { params: { id: string, appId: string } }) {
  const [application, setApplication] = useState<IApplication>();

  return (
    <Suspense fallback={<Loading />}>
      <Page title={application?.app_name}>
        <h1>{application?.app_name}</h1>
      </Page>
    </Suspense>
  );
}
