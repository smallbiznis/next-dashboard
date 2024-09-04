'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  CircleX,
  DollarSign,
  GripVertical,
  Plus,
  PlusCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import { IInventoryItem, IOption, IProduct, IVariant } from '@/types/product';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useRouter } from 'next/navigation';
import { debounceTime, Subject } from 'rxjs';

import '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Checkbox } from '@/components/ui/checkbox';

import {
  SortingState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
  RowData,
} from '@tanstack/react-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { OrganizationContext } from '@/context/organizationContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ILocation } from '@/types/organization';
import { useFormatter } from 'next-intl';

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const currency = (locale: string = 'id-ID', value: number) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'IDR',
    currencyDisplay: 'code',
  })
    .format(value)
    .replace('IDR', '')
    .trim();

export default function Page() {
  const router = useRouter();
  const { action } = useParams();

  const { loading, getOrg } = useContext(OrganizationContext);
  const org = getOrg();

  const [locations, setLocations] = useState<ILocation[]>([]);
  const [inventories, setInventories] = useState<IInventoryItem[]>([]);

  const fetchLocation = useCallback(async () => {
    await fetch(`/api/organizations/${org?.id}/locations`).then(async (res) => {
      const { data } = await res.json();
      if (res.status > 200 && res.status < 500) {
      }
      setLocations(data);
    });
  }, []);

  const [product, setProduct] = useState<IProduct>({
    title: '',
    slug: '',
    bodyHtml: '',
    options: [],
    status: 'active',
  });

  const [options, setOptions] = useState<IOption[]>(
    product.options || [
      {
        optionName: '',
        optionValues: [],
      },
    ]
  );

  const [variants, setVariants] = useState<IVariant[]>(product.variants || []);

  const doBack = () => router.back();
  const onChange = useCallback((e: any) => {
    const key = e.target.name;
    const value = e.target.value;
    setProduct((prev: any) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }, []);

  const onChangeStatus = useCallback((status: string) => {
    setProduct((prev: any) => ({
      ...prev,
      status,
    }));
  }, []);

  const addOption = () => {
    const option: IOption = {
      optionName: '',
      optionValues: [],
    };
    const updateOption = [...options];
    updateOption.push(option);
    setOptions(updateOption);
  };

  const onValueChange = (i: number, value: string) => {
    const updateOption = [...options];
    updateOption[i].optionName = value;
    setOptions(updateOption);
  };

  const removeOption = (index: number) => {
    const updateOption = [...options];
    updateOption.splice(index, 1);
    setOptions(updateOption);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    if (result.type === 'OPTION') {
      const orderItems = reorder(
        options,
        result.source.index,
        result.destination.index
      ) as IOption[];
      setOptions(orderItems);
    }

    if (result.type === 'OPTION_VALUES') {
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const parentId = result.source.droppableId as string;

      const parentItemIndex = parseInt(parentId.split('-')[1]);
      const optionValues = reorder(
        options[parentItemIndex].optionValues,
        sourceIndex,
        destinationIndex
      ) as string[];

      const updatedItems = [...options];
      updatedItems[parentItemIndex].optionValues = optionValues;
      setOptions(updatedItems);
    }
  };

  const subject = new Subject();
  subject
    .asObservable()
    .pipe(debounceTime(500))
    .subscribe((data: any) => {
      setOptions(data);
    });

  const onOptionValueChange = (
    parentIndex: number,
    childIndex: number,
    v: string
  ) => {
    const newOption = [...options];
    newOption[parentIndex].optionValues[childIndex] = v;
    subject.next(newOption);
  };

  const onRemoveOptionValue = (
    parentIndex: number,
    childIndex: number
  ) => {
    const newOption = [...options]
    newOption[parentIndex].optionValues.splice(childIndex, 1)
    console.log("newOption: ", newOption)
    setOptions(newOption)
  }

  const createVariant = async function generateVariants(options: IOption[]) {
    if (options.length === 0) return;

    // Start with the first option's values as the base for combinations
    let variants: string[][] = options[0].optionValues.map((value) => [value]);

    // Iterate over the rest of the options
    for (let i = 1; i < options.length; i++) {
      const currentOptionValues = options[i].optionValues;
      const newVariants: string[][] = [];

      // Combine each existing variant with each value of the current option
      for (const variant of variants) {
        if (currentOptionValues.length > 0) {
          for (const value of currentOptionValues) {
            if (value != '') newVariants.push([...variant, value]);
          }
        } else newVariants.push([...variant]);
      }

      variants = newVariants; // Update the variants with the new combinations
    }

    // await Promise.all(locations.map((loc) => {
    //   variants.map(() => {
    //     newInventories.push({
    //       locationId: loc.locationId,
    //       organizationId: org?.id,
    //       reorderStock: 0,
    //       reservedStock: 0,
    //     });
    //   });
    // }));

    let inventory: IInventoryItem[] = [];
    for (let i = 0; i < locations.length; i++) {
      const newInventories: IInventoryItem[] = []
      const loc = locations[i]
      if (variants.length > 0) variants.map(() => {
        newInventories.push({
          locationId: loc.locationId,
          organizationId: org?.id,
          reorderStock: 0,
          reservedStock: 0,
        })
      })

      inventory = newInventories
    }
    console.log("inventory: ", inventory.length)
    setInventories(inventory);

    let newVariants: IVariant[] = variants.map((variant) => {
      return {
        price: 0,
        cost: 0,
        attributes: variant,
        inventoryItems: [],
      };
    });

    setVariants(newVariants);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<IVariant, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        header: 'Variants',
        cell: ({ row }) => {
          const variant = row.original as IVariant;
          return (
            <div className='flex'>
              {/* @ts-ignore */}
              {variant?.attributes
                ?.toString()
                .replaceAll(',', '/')
                .toUpperCase()}
            </div>
          );
        },
      },
      {
        id: 'price',
        header: 'Price',
        cell: ({ cell, row }) => {
          const index = cell.id.split('_')[0];
          const variant = row.original as IVariant;
          return (
            <div className='relative'>
              <Input
                type='text'
                name='price'
                defaultValue={
                  variant?.price ? `Rp ${variant.price}` : ''
                }
                onFocus={(e) => e.target.select()}
                onContextMenu={(e) => e.preventDefault()}
                onChange={(e) => {
                  const { value } = e.target;
                  let sanitizedValue = value.replace(/[^0-9.]/g, '');
                  if (e.target.value == '') return;
                  const newVariant = [...variants];
                  console.log("cell: ", cell.id)
                  console.log("cell: ", newVariant)
                  newVariant[parseInt(index)].price = parseInt(sanitizedValue);
                  setVariants(newVariant);
                }}
                placeholder='e.g., 10.000'
              />
            </div>
          );
        },
      },
      {
        id: 'available',
        header: 'Available',
        cell: ({ cell, row }) => {
          const index = cell.id.split('_')[0];
          const inventory = inventories[parseInt(index)];
          return (
            <div className='relative'>
              <Input
                type='number'
                name='stock'
                min={0}
                defaultValue={inventory?.totalStock}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (e.target.value == '') value = 0;
                  const newInventories = [...inventories];
                  console.log("cell: ", cell.id)
                  newInventories[parseInt(index)].totalStock = value;
                  setInventories(newInventories);
                }}
                placeholder='e.g., 10'
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: variants,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const onSubmit = () => {
    console.log('variants: ', variants);
    console.log('inventories: ', inventories);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    // @ts-ignore
    createVariant(options);
  }, [options]);

  useEffect(() => {
    console.log("options: ", variants)
  }, [variants])

  const OptionMarkup = (
    <Card id='AddOption'>
      <CardContent className='grid gap-3 pt-6'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='options' type='OPTION'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {options.map((option, optionIndex) => (
                  <Draggable
                    draggableId={`option-${optionIndex}`}
                    index={optionIndex}
                  >
                    {(provided) => (
                      <div
                        key={`option-${optionIndex}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className='w-full'>
                          <div className='mb-2 flex'>
                            <div className='flex items-start'>
                              <button
                                type='button'
                                className='flex-0 mr-2 pt-2'
                              >
                                <GripVertical />
                              </button>
                            </div>
                            <div className='grid w-full gap-3'>
                              <div className='item-center flex w-full'>
                                <input
                                  type='text'
                                  name={`option-${optionIndex}`}
                                  defaultValue={option.optionName}
                                  minLength={2}
                                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                  onChange={(e) =>
                                    onValueChange(optionIndex, e.target.value)
                                  }
                                  placeholder='e.g., Color'
                                />
                                {options.length > 1 && (
                                  <Button
                                    type='button'
                                    variant={'outline'}
                                    size={'icon'}
                                    className='ml-2'
                                    onClick={() => removeOption(optionIndex)}
                                  >
                                    <Trash2 className='h-6 w-6' />
                                  </Button>
                                )}
                              </div>
                              <div>
                                <Droppable
                                  droppableId={`option-${optionIndex}`}
                                  type='OPTION_VALUES'
                                >
                                  {(provided) => (
                                    <div
                                      key={`option-${optionIndex}-drop`}
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className='grid gap-2'
                                    >
                                      {option.optionValues.length > 0 ? (
                                        option.optionValues.map(
                                          (value, index) => {
                                            return (
                                              <>
                                                <Draggable
                                                  draggableId={`option-${index}-values`}
                                                  index={index}
                                                >
                                                  {(provided) => (
                                                    <div
                                                      key={`option-${index}-values`}
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      {...provided.dragHandleProps}
                                                    >
                                                      <div className='flex'>
                                                        <button
                                                          type='button'
                                                          className='flex-0 mr-2'
                                                        >
                                                          <GripVertical />
                                                        </button>
                                                        <div className='relative w-full'>
                                                          <input
                                                            type='text'
                                                            name={`option-${index}-values`}
                                                            defaultValue={value}
                                                            minLength={1}
                                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                            onChange={(e) =>
                                                              onOptionValueChange(
                                                                optionIndex,
                                                                index,
                                                                e.target.value
                                                              )
                                                            }
                                                            placeholder='e.g., Black'
                                                          />
                                                          {option.optionValues
                                                            .length > 1 && (
                                                            <span className='absolute inset-y-0 right-0 flex items-center pr-2'>
                                                              <CircleX className='text-gray-500' onClick={() => onRemoveOptionValue(optionIndex, index)} />
                                                            </span>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                                {option.optionValues[
                                                  index + 1
                                                ] == undefined &&
                                                  option.optionValues[index]
                                                    .length > 0 && (
                                                    <Draggable
                                                      key={`option-${index + 1}-values`}
                                                      draggableId={`option-${index + 1}-values`}
                                                      index={0}
                                                    >
                                                      {(provided) => (
                                                        <div
                                                          ref={
                                                            provided.innerRef
                                                          }
                                                          {...provided.draggableProps}
                                                          {...provided.dragHandleProps}
                                                        >
                                                          <div className='flex'>
                                                            <button
                                                              type='button'
                                                              className='flex-0 mr-2'
                                                            >
                                                              <GripVertical />
                                                            </button>
                                                            <div className='relative w-full'>
                                                              <input
                                                                type='text'
                                                                name={`option-${index + 1}-values`}
                                                                defaultValue={''}
                                                                minLength={1}
                                                                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                                onChange={(e) =>
                                                                  onOptionValueChange(
                                                                    optionIndex,
                                                                    index+1,
                                                                    e.target
                                                                      .value
                                                                  )
                                                                }
                                                                placeholder='e.g., Black'
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </Draggable>
                                                  )}
                                              </>
                                            );
                                          }
                                        )
                                      ) : (
                                        <Draggable
                                          key={`option-0-values`}
                                          draggableId={`option-0-values`}
                                          index={0}
                                        >
                                          {(provided) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <div className='flex'>
                                                <button
                                                  type='button'
                                                  className='flex-0'
                                                >
                                                  <GripVertical />
                                                </button>
                                                <div className='relative w-full'>
                                                  <input
                                                    type='text'
                                                    name={`option-0-values`}
                                                    minLength={1}
                                                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                    onChange={(e) =>
                                                      onOptionValueChange(
                                                        optionIndex,
                                                        0,
                                                        e.target.value
                                                      )
                                                    }
                                                    placeholder='e.g., Black'
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      )}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button type='button' size={'sm'} onClick={addOption}>
          <div className='flex items-center justify-center'>
            <PlusCircle className='mr-2' />
            <div className='text-center'>Add another option</div>
          </div>
        </Button>
      </CardContent>
      {variants.length > 0 && (
        <CardContent>
          <ScrollArea>
            {/* @ts-ignore */}
            <DataTable columns={columns} table={table} />
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );

  const PricingMarkup = (
    <Card>
      <CardContent className='grid gap-3 pt-6'></CardContent>
    </Card>
  );

  const PageMarkup = (
    <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
      <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
        {/* Product Info */}
        <Card x-chunk='dashboard-07-chunk-0' id='AddTitle'>
          <CardContent className='mt-6'>
            <div className='grid gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>Title</Label>
                <Input
                  id='title'
                  type='text'
                  className='w-full'
                  defaultValue={product.title}
                  onChange={onChange}
                  placeholder='e.g., iPhone 14 Pro Max'
                  required
                />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='description'>Description</Label>
                {/* <ReactQuill
                    id="bodyHtml"
                    className="min-h-32"
                    theme="snow"
                    placeholder="Enter the description..........."
                  /> */}
                <Textarea
                  id='bodyHtml'
                  className='min-h-32'
                  defaultValue={product?.bodyHtml}
                  onChange={onChange}
                  placeholder='e.g., The latest iPhone model with advanced features and improved battery life.'
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        {PricingMarkup}

        {/* Add product option */}
        {OptionMarkup}

        {/* Upload Image */}
        {/* <Card
            className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
          >
            <CardContent className="mt-6">
              <div className="grid gap-2">
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button>
                    <Image
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="84"
                      src="/placeholder.svg"
                      width="84"
                    />
                  </button>
                  <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card> */}
      </div>
      <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
        <Card x-chunk='dashboard-07-chunk-3'>
          <CardContent className='mt-6'>
            <div className='grid gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='status'>Status</Label>
                <Select value={product?.status} onValueChange={onChangeStatus}>
                  <SelectTrigger id='status' aria-label='Select status'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const LoadingMarkup = (
    <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
      <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
        <Skeleton className={`h-[268px] w-full bg-gray-300`} />
        <Skeleton className={`h-[138px] w-full bg-gray-300`} />
      </div>
      <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
        <Skeleton className={`h-[90px] w-full bg-gray-300`} />
      </div>
    </div>
  );

  return (
    <div className='mx-auto grid w-full flex-1 auto-rows-max gap-4 sm:max-w-[59rem]'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          className='h-7 w-7'
          onClick={doBack}
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Back</span>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          {action == 'new' ? 'Add product' : product?.title}
        </h1>
        {action != 'new' && (
          <Badge variant='outline' className='ml-auto sm:ml-0'>
            In stock
          </Badge>
        )}
        <div className='hidden items-center gap-2 md:ml-auto md:flex'>
          {/* <Button variant="destructive" size="sm">
            Discard
          </Button> */}
          <Button disabled={loading} onClick={onSubmit} size='sm'>
            Save Product
          </Button>
        </div>
      </div>
      {loading ? LoadingMarkup : PageMarkup}
      <div className='flex items-center justify-end gap-2 md:hidden'>
        {/* <Button variant="destructive" size="sm">
          Discard
        </Button> */}
        <Button disabled={loading} onClick={onSubmit} size='sm'>
          Save Product
        </Button>
      </div>
    </div>
  );
}
