'use client'
import { Page } from '@/components/page';
import { useState } from 'react';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

export async function getStaticPaths() {
  return {
    paths: [],
  }
}

export default function Orders() {

  return (
    <Page title={'Orders'}>
      <h1>Orders</h1>
    </Page>
  );
}
