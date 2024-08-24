'use client';

import { Suspense, useEffect, useState } from 'react';
import { Page } from '@/components/page';
import Loading from './loading';
import { IApplication } from '@/types/application';
import { faro } from '@grafana/faro-web-sdk';

export default function Application({ params }: { params: { id: string, appId: string } }) {
  const [application, setApplication] = useState<IApplication>();

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "DETAIL_APPLICATION"})
      // @ts-ignore
      faro.api.pushEvent("DETAIL_APPLICATION", {
        ...application
      })
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Page title={application?.app_name}>
        <h1>{application?.app_name}</h1>
      </Page>
    </Suspense>
  );
}
