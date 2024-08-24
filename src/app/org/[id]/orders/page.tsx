'use client'
import { Page } from '@/components/page';
import { useState } from 'react';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';

export default function Orders({params}:{params: {id:string}}) {

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "LIST_ORDER"})
    }
  }, [])

  return (
    <Page title={'Orders'}>
      <h1>Orders</h1>
    </Page>
  );
}
