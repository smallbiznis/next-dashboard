'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { faro } from '@grafana/faro-web-sdk';
import { useCallback, useEffect, useState } from 'react';
import { IProduct } from "@/types/product";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, CheckCircle, File, ImageOff, LoaderCircle, MoreHorizontal, PlusCircle } from "lucide-react"
import Image from "next/image";
import { randomUUID } from "crypto";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { wait } from "@/lib/utils";

export default function Products({params}:{params: {id:string}}) {

  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [tab, setTab] = useState("*")
  const [products, setProducts] = useState<IProduct[]>([
    {
      id: "123",
      title: "ABC",
      bodyHtml: "wow",
      status: "active"
    }
  ])

  const columns : ColumnDef<IProduct>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const product = row.original
        return (
          // <Image width={100} height={100} sizes="100vw" style={{
          //   width: '100%',
          //   height: 'auto'
          // }} alt={product.title} src={"https://picsum.photos/200"} />
          <image href={'https://picsum.photos/200'} />
        )
      }
    },
    {
      accessorKey: "product",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex">
            <div className="mx-4">
              <div className="font-medium">{product.title}</div>
              <div className="font-light">{product.title}</div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status"
    },
    {
      id: "actions",
      cell: ({row}) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={{
                  pathname: `${pathname}/${product.id}`,
                }}>View Detail</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const onTabChange = useCallback((value:string) => {
    setTab(value)
  }, [])

  const doExport = useCallback(() => {
    const newToast = toast({
      title: "Data Export Started",
      description: "Processing your request.",
      action: <LoaderCircle className="animate-spin" />
    })

    // wait(2000).then(() => newToast.update({
    //   id: newToast.id,
    //   title: "Data Processing",
    //   description: "Your export is being generated.",
    //   action: <LoaderCircle className="animate-spin" />
    // }))

    wait(3000).then(() => newToast.update({
      id: newToast.id,
      title: "Completed",
      description: "Your export is being generated.",
      action: <Check className="rounded-full bg-emerald-500" />
    }))

    wait(4000).then(() => newToast.dismiss)
  }, [])

  const doAddProduct = () => router.push(`${pathname}/new`)

  useEffect(() => {

  }, [])

  const tabsMarkup = (
    <div>
      <Tabs value={tab} onValueChange={onTabChange}>
        <div className="flex item-center">
          <TabsList>
            <TabsTrigger value="*">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive" className="hidden sm:flex">Inactive</TabsTrigger>
            <TabsTrigger value="archived" className="hidden lg:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 gap-1" onClick={doExport}>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-7 gap-1" onClick={doAddProduct}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value={tab}>
          <DataTable columns={columns} data={products} />
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <>
      {tabsMarkup}
    </>
  );
}
