import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function Settings({ params }: { params: { id: string } }) {
  return (
    <>
      <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-3xl font-semibold'>Settings</h1>
      </div>
      <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
        <nav
          className='grid gap-4 text-sm text-muted-foreground'
          x-chunk='dashboard-04-chunk-0'
        >
          <Link href='#' className='font-semibold text-primary'>
            General
          </Link>
        </nav>
        <div className='grid gap-6'>
          <Card x-chunk='dashboard-04-chunk-1'>
            <CardHeader>
              <CardTitle>Organization Name</CardTitle>
              <CardDescription>
                Used to identify your organization in the marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder='Organization Name' />
              </form>
            </CardContent>
            <CardFooter className='border-t px-6 py-4'>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
