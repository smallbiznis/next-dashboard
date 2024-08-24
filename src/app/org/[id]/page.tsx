'use client';
import { Page } from '@/components/page';
import LineChartMultiple from '@/components/chart/line-chart-multiple'
import { faro } from '@grafana/faro-web-sdk';
import { useEffect, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import { DatePickerWithRange } from '@/components/date-picker-with-range';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';

export default function Home() {

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "overview"}) 
    }
  }, [])

  return (
    <Page>
      <DatePickerWithRange date={date} setDate={setDate}  />
      {/* <div className='grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row auto-cols-max'>
        <LineChartMultiple />
      </div> */}
    </Page>
  );
}
