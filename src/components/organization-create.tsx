
import { useState } from 'react';
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators';
import { Check, LoaderCircle, Plus, RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetPortal, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IOrganization } from '@/types/organization';
import { useToast } from './ui/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { wait } from '@/lib/utils';

export function OrganizationCreate() {

  const { toast } = useToast()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [organization, setOrganization] = useState<IOrganization | undefined>()

  const subject = new Subject();
  subject
    .asObservable()
    .pipe(debounceTime(1000))
    .subscribe((data:any) => {
      lookupOrganization(data.title).
        then( async (res) => {
          const data = await res.json()
          if (data.ok) setDisabled(false)
          else setDisabled(true)
        })

      setOrganization(data)
    });

  const onChange = (ev:any) => {
    ev.preventDefault()

    const name = ev.target.name
    const value = ev.target.value

    subject.next({
      [name]: value
    })
  }

  const lookupOrganization = async (title:string) => {
    const params = new URLSearchParams()
    // @ts-ignore
    params.set("title", title.toLowerCase())
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
          id: newToast.id,
          title: "Failed!",
          variant: "destructive",
          description: "Failed create a organization!",
        })
        wait().then(() => newToast.dismiss())
        return
      }

      newToast.update({
        id: newToast.id,
        title: "Success!",
        description: "Your organization has been created.",
        action: <Check className='text-emerald-500' />,
      })

      wait().then(() => {
        newToast.dismiss()
        window.location.reload()
      })
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

  const onSubmit = async (event:any) => {
    event.preventDefault();
    setOpen(false)
    await createOrganization()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        <form onSubmit={onSubmit}
        >
          <div className='grid w-full max-w-sm items-center gap-1.5 py-4'>
            <Label htmlFor="title" className="text-left text-[1.6rem] mb-4">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Let's start with a name for your organization
            </Label>
            {/* @ts-ignore */}
            <Input
              id="title"
              name='title'
              minLength={4}
              maxLength={20}
              placeholder='Enter your organization name'
              className="col-span-3"
              onChange={onChange} 
              required={true}
            />
          </div>
          <div className='flex justify-end'>
            <Button type='submit' disabled={disabled}>
              {/* {loading && <LoaderCircle className='ml-4 animate-spin' />} */}
              Create organization
            </Button>
          </div>
        </form>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type='button' disabled={disabled} onClick={disabled ? () => {} : () => createOrganization()}>
              Create organization
            </Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}