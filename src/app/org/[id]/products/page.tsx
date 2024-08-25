'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/data-table';
import { Page } from '@/components/page';
import { faro } from '@grafana/faro-web-sdk';
import { useEffect, useState } from 'react';
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
import { ImageOff, MoreHorizontal } from "lucide-react"
import Image from "next/image";
import { randomUUID } from "crypto";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Products({params}:{params: {id:string}}) {

  const pathname = usePathname()
  const [products, setProducts] = useState<IProduct[]>([
    {
      id: "abc123",
      resources: [],
      slug: "demo-product-1",
      title: "demo product 1",
      status: "active"
    },
    {
      id: "abc124",
      resources: [],
      slug: "demo-product-1",
      title: "demo product 1",
      status: "active"
    },
    {
      id: "abc125",
      resources: [],
      slug: "demo-product-1",
      title: "demo product 1",
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
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex">
            <div className="flex justify-center items-center">
              {product.resources.length > 0 ? (
                <div style={{ width: "50px", height: "50px", display: 'flex', flexDirection: 'column' }}>
                  {/* <Image
                    alt=""
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    width={100}
                    height={100}
                    objectFit="fill"
                    src={product.resources[0].imgUrl}
                  /> */}
                  <image
                    href={product.resources[0].imgUrl}
                  />
                </div>
              ) : <ImageOff className="w-[50px] h-[50px]" />}
            </div>
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

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "product_listing"})
    }
  }, [])

  useEffect(() => {

  }, [])

  return (
    <Page title={'Products'}>
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={products} />
      </div>
    </Page>
  );
}
