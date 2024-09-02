'use client';

import { Page } from '@/components/page';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect, useState } from 'react';

import { DatePickerWithRange } from '@/components/date-picker-with-range';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

export default function Home() {

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  return (
    <Page>
      <DatePickerWithRange date={date} setDate={setDate}  />
    </Page>
  );
}
