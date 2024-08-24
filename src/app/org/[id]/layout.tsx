'use client';

// import '@/app/globals.css';
import { Inter as FontSans } from 'next/font/google';
import Link from 'next/link';
import {
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Menu,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { usePathname, useRouter } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { useContext, useEffect, useState } from 'react';
import { SelectComponent } from '@/components/select';
import { Application } from '@/components/application-menu';
import { OrganizationContext } from '@/context/organizationContext';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

interface RootLayoutProps {
  params: {
    id: string
  }
  children: React.ReactNode;
}

export default function OrganizationLayout({ params, children }: RootLayoutProps) {
  const pathname = usePathname();
  const router = useRouter()

  const {orgs} = useContext(OrganizationContext)
  const [selectOrg, setSelectOrg] = useState(params.id)
  const [menus, setMenus] = useState([
    {
      path: '/org/{id}',
      title: 'Home',
      icon: <Home className='h-4 w-4' />,
      items: [],
    },
    {
      path: '/org/{id}/orders',
      title: 'Orders',
      icon: <ShoppingCart className='h-4 w-4' />,
      items: [],
    },
    {
      path: '/org/{id}/products',
      title: 'Products',
      icon: <Tag className='h-4 w-4' />,
    },
    {
      path: '/org/{id}/inventory',
      title: 'Inventory',
      icon: <Package className='h-4 w-4' />,
    },
    {
      path: '/org/{id}/customers',
      title: 'Customers',
      icon: <Users className='h-4 w-4' />,
      items: [],
    },
    {
      path: '/org/{id}/analytics',
      title: 'Analytics',
      icon: <LineChart className='h-4 w-4' />,
      items: [],
    },
    {
      path: '/org/{id}/settings',
      title: 'Settings',
      icon: <Settings className='h-4 w-4' />,
      items: [],
    },
  ]);

  useEffect(() => {
    router.replace(`/org/${selectOrg}`)
  }, [selectOrg])

  const navigationMenuMarkup = menus.map((m) => {
    m.path = m.path.replace('{id}', selectOrg)
    return (
      <Link
        key={m.path}
        href={m.path}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname == m.path ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
      >
        {m.icon}
        {m.title}
      </Link>
    );
  });

  const headerMarkup = (
    <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='flex flex-col'>
          <nav className='grid gap-2 text-lg font-medium'>
            {navigationMenuMarkup}
          </nav>
          {/* <div className='mt-auto'>
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size='sm' className='w-full'>
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </SheetContent>
      </Sheet>

      <div>
        <SelectComponent value={selectOrg} onValueChange={setSelectOrg} items={orgs} />
      </div>
    </header>
  )

  return (
    <>
      <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
        <div className='hidden border-r bg-muted/40 md:block'>
          <div className='flex h-full max-h-screen flex-col gap-2'>
            <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
              <Link
                href='/'
                className='flex items-center gap-2 text-lg'
              >
                <div className='font-light'>
                  <span className='font-medium'>Small</span>Biznis
                </div>
              </Link>
            </div>
            <div className='flex-0'>
              <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                {navigationMenuMarkup}
              </nav>
            </div>

            <div className='flex-1'>
              <div className='px-2 lg:px-4'>
                <span className='px-3 text-sm font-medium text-muted-foreground'>
                  App
                </span>
              </div>

              {/* <Application {...params}  /> */}
            </div>

            {/* <div className='flex-1 mt-auto'>
              <div className='px-2 lg:px-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our support
                      team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size='sm' className='w-full'>
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div> */}

          </div>
        </div>

        <div className='flex flex-col'>
          {headerMarkup}
          <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
