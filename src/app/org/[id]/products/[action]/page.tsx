'use client'

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, GripVertical, Plus, PlusCircle, Trash2, Upload } from "lucide-react";
import { IOption, IProduct } from "@/types/product";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRouter } from "next/navigation";
import { debounceTime, Subject } from "rxjs";
import Variants from "./variants";

const reorder = (list:any[], startIndex:number, endIndex:number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function Page({params}:{params: {id:string, action:string}}) {

  const { id, action } = params
  const router = useRouter()
  const [product, setProduct] = useState<IProduct>({
    title: "",
    slug: "",
    bodyHtml: "",
    options: [
      {
        optionName: "",
        optionValues: []
      }
    ],
    status: "active"
  })
  const [options, setOptions] = useState<IOption[]>(product.options || [
    {
      optionName: "",
      optionValues: []
    }
  ])

  const [variants, setVariants] = useState<any[]>([])

  const doBack = () => router.back()
  const onChange = useCallback((e:any) => {
    const key = e.target.name
    const value = e.target.value
    setProduct((prev:any) => {
      return {
        ...prev,
        [key]: value
      }
    })
  }, [])

  const onChangeStatus = useCallback((status:string) => {
    setProduct((prev:any) => ({
      ...prev,
      status,
    }))
  }, [])

  const addOption = () => {
    const option: IOption = {
      optionName: '',
      optionValues: []
    }
    const updateOption = [...options]
    updateOption.push(option)
    setOptions(updateOption)
  }

  const onValueChange = (i:number, value:string) => {
    const updateOption = [...options]
    updateOption[i].optionName = value
    setOptions(updateOption)
  }

  const removeOption = (index:number) => {
    const updateOption = [...options]
    updateOption.splice(index, 1)
    setOptions(updateOption)
  }

  const onDragEnd = (result:any) => {
    if (!result.destination) return;

    if (result.type === "OPTION") {
      const orderItems = reorder(options, result.source.index, result.destination.index) as IOption[]
      setOptions(orderItems)
    }

    if (result.type === "OPTION_VALUES") {
      console.log("result: ", result)
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const parentId = result.source.droppableId as string;

      const parentItemIndex = parseInt(parentId.split('-')[1])
      const optionValues = reorder(options[parentItemIndex].optionValues, sourceIndex, destinationIndex) as string[];
      console.log("values: ", optionValues)
      const updatedItems = [...options];
      console.log("before: ", updatedItems)
      updatedItems[parentItemIndex].optionValues = optionValues
      console.log("after: ", updatedItems)
      setOptions(updatedItems)
    }
  };

  const addOptionValue = (parentIndex:number) => {
    const newOption = [...options]
    newOption[parentIndex].optionValues.push('')
    setOptions(newOption)
  }

  const subject = new Subject();
  subject
    .asObservable()
    .pipe(debounceTime(500))
    .subscribe((data:any) => {
      setOptions(data)
    });

  const onOptionValueChange = (parentIndex:number, childIndex:number, v:string) => {
    const newOption = [...options]
    newOption[parentIndex].optionValues[childIndex] = v
    subject.next(newOption)
  }

  const createVariant = function generateVariants(options: IOption[]) {
    if (options.length === 0) return

    // Start with the first option's values as the base for combinations
    let variants: string[][] = options[0].optionValues.map(value => [value]);

    // Iterate over the rest of the options
    for (let i = 1; i < options.length; i++) {
      const currentOptionValues = options[i].optionValues;
      const newVariants: string[][] = [];

      // Combine each existing variant with each value of the current option
      for (const variant of variants) {
        for (const value of currentOptionValues) {
          if (value != '') newVariants.push([...variant, value]);
        }
      }

      variants = newVariants; // Update the variants with the new combinations
    }

    setVariants(variants)
  }

  useEffect(() => {
    // @ts-ignore
    createVariant(options)
  }, [options])

  return (
    <div className="mx-auto grid w-full sm:max-w-[59rem] flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={doBack}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {action == "new" ? "Add product" : product?.title}
        </h1>
        {action != "new" && (
          <Badge variant="outline" className="ml-auto sm:ml-0">
            In stock
          </Badge>
        )}
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          {/* <Button variant="destructive" size="sm">
            Discard
          </Button> */}
          <Button size="sm">Save Product</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardContent className="mt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    className="w-full"
                    defaultValue={product.title}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="bodyHtml"
                    className="min-h-32"
                    defaultValue={product?.bodyHtml}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 grid gap-3">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="options" type="OPTION">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {options.map((option, optionIndex) => (
                        <Draggable key={`option-${optionIndex}`} draggableId={`option-${optionIndex}`} index={optionIndex}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="w-full">
                                <div className="flex mb-6">
                                  <div className="flex items-start">
                                    <button type="button" className="flex-0 pt-2">
                                      <GripVertical />
                                    </button>
                                  </div>
                                  <div className="grid gap-3 w-full">
                                    <div className="w-full flex item-center">
                                      <input
                                        type="text"
                                        name={`option-${optionIndex}`}
                                        value={option.optionName}
                                        minLength={2}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        onChange={(e) => onValueChange(optionIndex, e.target.value)}
                                      />
                                      {options.length > 1 && (
                                        <button
                                          type="button"
                                          className="flex-0 text-destructive"
                                          onClick={() => removeOption(optionIndex)}
                                        >
                                          <Trash2 />
                                        </button>
                                      )}
                                    </div>
                                    <div>
                                      <Droppable droppableId={`option-${optionIndex}`} type="OPTION_VALUES">
                                        {(provided, snapshot) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="grid gap-2"
                                          >
                                            {option.optionValues.length > 0 ? option.optionValues.map((value, index) => (
                                              <Draggable key={`option-${index}-values`} draggableId={`option-${index}-values`} index={index}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <div className="flex">
                                                      <button type="button" className="flex-0">
                                                        <GripVertical />
                                                      </button>
                                                      <input
                                                          type="text"
                                                          name={`option-${index}`}
                                                          defaultValue={value}
                                                          minLength={2}
                                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                          onChange={(e) => onOptionValueChange(optionIndex, index, e.target.value)}
                                                        />
                                                    </div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            )): (
                                              <Draggable key={`option-0-values`} draggableId={`option-0-values`} index={0}>
                                                {(provided, snapshot) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                  >
                                                    <div className="flex">
                                                      <button type="button" className="flex-0">
                                                        <GripVertical />
                                                      </button>
                                                      <input
                                                          type="text"
                                                          name={`option-0`}
                                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                          onChange={(e) => onOptionValueChange(optionIndex, 0, e.target.value)}
                                                        />
                                                    </div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            )}
                                            <Button type="button" size={"sm"} onClick={(e) => addOptionValue(optionIndex)}>
                                              <div className="flex justify-center items-center">
                                                <PlusCircle className="mr-2" />
                                                <div className="text-center">Add another value</div>
                                              </div>
                                            </Button>
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
              <Button type="button" size={"sm"} onClick={addOption}>
                <div className="flex justify-center items-center">
                  <PlusCircle className="mr-2" />
                  <div className="text-center">Add another option</div>
                </div>
              </Button>
            </CardContent>
            <CardContent>
              <Variants variants={variants} />
            </CardContent>
          </Card>

          <Card
            className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
          >
            <CardContent className="mt-6">
              <div className="grid gap-2">
                {/* <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="300"
                /> */}
                <div className="grid grid-cols-3 gap-2">
                  {/* <button>
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
                  </button> */}
                  {/* <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-3">
            <CardContent className="mt-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select value={product?.status} onValueChange={onChangeStatus}>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 md:hidden">
        {/* <Button variant="destructive" size="sm">
          Discard
        </Button> */}
        <Button size="sm">Save Product</Button>
      </div>
    </div>
  );
}
