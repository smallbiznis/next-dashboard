import { IOrganization } from "@/types/organization";
import { createContext, ReactNode, useCallback, useEffect, useState } from "react";

interface OrganizationContextProps {
  loading: boolean
  orgs: IOrganization[]
  selected: IOrganization | null
}

// @ts-ignore
export const OrganizationContext = createContext<OrganizationContextProps>()

export const OrganizationProvider = ({ children } : { children:ReactNode }) => {

  const [loading, setLoading] = useState(true)
  const [orgs, setOrgs] = useState<IOrganization[]>([])
  const [selected, setSelected] = useState<IOrganization | null>(null)

  const fetchOrgs = useCallback(async() => {
    await fetch(`/api/user/organizations`, {
      method: "GET"
    }).then( async (res) => {
      const {data} = await res.json()
      if (res.status > 200 && res.status < 500) {}
      const newData = data.map((v:any) => v.organization)
      setOrgs(newData)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    fetchOrgs()
  }, [])

  return (
    <OrganizationContext.Provider value={{loading, orgs, selected}}>
    {children}
    </OrganizationContext.Provider>
  )
}