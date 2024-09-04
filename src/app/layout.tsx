'use client';

import '@/app/globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

import { CircleUser, BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Suspense, useEffect } from 'react';
import { initSDKFaro } from '@/lib/faro-sdk';
import { Metadata } from 'next';
import Head from 'next/head';
import { ThemeToggle } from '@/components/theme-toggle';
import { OrganizationProvider } from '@/context/organizationContext';
import { Toaster } from '@/components/ui/toaster';
import { NavigationEvents } from '@/components/navigation';
import { faro } from '@grafana/faro-web-sdk';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}`;

    // if (!faro.api) {
    //   initSDKFaro()
    // }

    // if (faro.api) {
    //   faro.api.setView({
    //     name: url
    //   })
    // }
  }, [pathname, searchParams]);

  const userMenuMarkup = (
    <div className='my-2 flex max-h-screen w-[56px] flex-col justify-between'>
      <div className='flex flex-col justify-center'>
        <div className='mb-2 flex justify-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <Avatar>
                  <AvatarFallback aria-label='Taufik Triantono (taufiktriantono4@gmail.com)'>
                    TT
                  </AvatarFallback>
                </Avatar>
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='mb-2 flex justify-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <BellIcon className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head>
          <title>Small Biznis</title>
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <OrganizationProvider>
              <div vaul-drawer-wrapper=''>
                <div className='grid min-h-screen w-full grid-cols-[1fr_56px]'>
                  <div className='border-r bg-muted/40 md:block'>
                    {children}
                  </div>
                  {userMenuMarkup}
                </div>
              </div>
              <Toaster />
            </OrganizationProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
