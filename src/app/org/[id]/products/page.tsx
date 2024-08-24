'use client'
import { Page } from '@/components/page';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';

export default function Products({params}:{params: {id:string}}) {

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "product_listing"})
    }
  }, [])

  return (
    <Page title={'Products'}>
      <h1>Products</h1>
    </Page>
  );
}
