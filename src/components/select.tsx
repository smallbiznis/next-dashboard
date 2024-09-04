import { Dispatch, SetStateAction } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IOrganization } from '@/types/organization';

interface SelectProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
  items: IOrganization[];
}

export function SelectComponent({ value, onValueChange, items }: SelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='w-[280px]'>
        <SelectValue placeholder='Select Organization' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => {
            // @ts-ignore
            return (
              // @ts-ignore
              <SelectItem key={item.organizationId} value={item.organizationId}>
                {item.title}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
