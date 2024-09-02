'use client';

import { Suspense, useEffect, useState } from 'react';
import { Page } from '@/components/page';
import Loading from './loading';
import { faro } from '@grafana/faro-web-sdk';
import { IApplication } from '@/types/application';

export default function Applications({params}:{params: {id:string}}) {

  const [applications, setApplications] = useState<IApplication[]>([])

  return (
    <Suspense fallback={<Loading />}>
      <Page title={'Apps'}>
        <></>
      </Page>
    </Suspense>
  );
}
