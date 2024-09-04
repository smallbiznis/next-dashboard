'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const [selectDays, setSelectDays] = useState('-30');
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: addDays(new Date(), parseInt(selectDays)),
  //   to: new Date(),
  // })
  const [listDays, setListDays] = useState([
    {
      name: 'Today',
      value: '0',
    },
    {
      name: 'Yesterday',
      value: '-1',
    },
    {
      name: 'Last 7 days',
      value: '-7',
    },
    {
      name: 'Last 30 days',
      value: '-30',
    },
    {
      name: 'Last 90 days',
      value: '-90',
    },
  ]);

  useEffect(() => {
    setDate((prev: any) => {
      return {
        to:
          parseInt(selectDays) < -1
            ? new Date()
            : addDays(new Date(), parseInt(selectDays)),
        from: addDays(new Date(), parseInt(selectDays)),
      };
    });
  }, [selectDays]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='flex w-auto p-0' align='start'>
          <div className='p-4'>
            {listDays.map((day) => {
              return (
                <div key={day.value}>
                  <Button
                    type='button'
                    variant={selectDays == day.value ? 'default' : 'ghost'}
                    className='mb-2 w-full justify-start'
                    onClick={() => setSelectDays(day.value)}
                  >
                    {day.name}
                  </Button>
                </div>
              );
            })}
          </div>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
