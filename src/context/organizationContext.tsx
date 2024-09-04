import { IOrganization } from '@/types/organization';
import { getOverlappingDaysInIntervals } from 'date-fns';
import { useParams } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface OrganizationContextProps {
  loading: boolean;
  orgs: IOrganization[];
  selected: IOrganization | null;
  setSelected: Dispatch<SetStateAction<IOrganization | null>>;
  getOrg: () => IOrganization | null;
}

// @ts-ignore
export const OrganizationContext = createContext<OrganizationContextProps>();

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<IOrganization[]>([]);
  const [selected, setSelected] = useState<IOrganization | null>(null);

  const fetchOrgs = useCallback(async () => {
    await fetch(`/api/user/organizations`, {
      method: 'GET',
    }).then(async (res) => {
      const { data } = await res.json();
      if (res.status > 200 && res.status < 500) {
      }
      const newData = data.map((v: any) => v.organization);
      setOrgs(newData);
      setLoading(false);
    });
  }, []);

  const getOrg = () => {
    const org = orgs.filter((org) => org.organizationId == id);
    if (org.length > 0) return org[0];
    return null;
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{ loading, orgs, selected, setSelected, getOrg }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
