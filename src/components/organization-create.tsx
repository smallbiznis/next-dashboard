
import { Check, LoaderCircle, Plus, RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetPortal, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { IOrganization } from '@/types/organization';
import { useToast } from './ui/use-toast';

export function OrganizationCreate() {

  const { toast } = useToast()
  const [error, setError] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [organization, setOrganization] = useState<IOrganization | undefined>()

  const onChange = (ev:ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault()
    console.log("ev: ", typeof ev.target.value)
    if (ev.target.value != '') {
      lookupOrganization(ev.target.value).
      then( async (res) => {
        if (res.status > 200 && res.status < 500) {}
        const data = await res.json()
        if (!data.ok) setError("organization name not available")
        setDisabled(false)
        setOrganization(() => {
          return {
            [ev.target.name]: ev.target.value
          }
        })
      })
    } else setDisabled(true)
  }

  const lookupOrganization = async (title:string) => {
    const params = new URLSearchParams()
    // @ts-ignore
    params.set("title", title)
    return fetch(`/api/organizations?${params.toString()}`)
  }

  const createOrganization = async () => {
    const newToast = toast({
      title: "Please wait",
      description: "Your organization under process...",
      action: <LoaderCircle className='animate-spin' />
    })
    await fetch('/api/organizations', {
      method: "POST",
      body: JSON.stringify(organization)
    }).then(async(res) => {
      if (res.status > 200) {
        newToast.update({
          variant: "destructive",
          title: "Failed!",
          description: "Your organization has been created.",
          action: <Check className='text-emerald-500' />,
          id: newToast.id
        })
        setTimeout(() => newToast.dismiss(), 2000)
        return
      }

      newToast.update({
        id: newToast.id,
        title: "Success!",
        description: "Your organization has been created.",
        action: <Check className='text-emerald-500' />,
      })
      setTimeout(() => newToast.dismiss(), 2000)
    }).catch(error => {
      newToast.update({
        id: newToast.id,
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: undefined
      })
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className='h-full flex justify-center items-center p-6'>
          <div className='flex flex-col justify-center item-center'>
            <Plus className='flex self-center w-14 h-14' />
            <span className='font-normal'>Create Organization</span>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent side={"left"} className='w-full'>
        <SheetHeader className='text-left'>
          <SheetTitle className='font-light'>Create a organization</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className='grid w-full max-w-sm items-center gap-1.5 py-4'>
          <Label htmlFor="title" className="text-left text-[1.6rem] mb-4">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Let's start with a name for your organization
          </Label>
          {/* @ts-ignore */}
          <Input
            id="title"
            name='title'
            placeholder='Enter your organization name'
            className="col-span-3"
            onChange={onChange} 
            required
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='button' disabled={disabled} onClick={disabled ? () => {} : () => createOrganization()}>
              Create organization
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}