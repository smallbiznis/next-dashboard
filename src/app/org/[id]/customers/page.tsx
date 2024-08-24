'use client'
import { Page } from '@/components/page';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';

export default function Customers({params}:{params: {id:string}}) {

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "LIST_CUSTOMER"})
    }
  }, [])

  return (
    <Page title={'Customers'}>
      <h1>Customers</h1>
    </Page>
  );
}
