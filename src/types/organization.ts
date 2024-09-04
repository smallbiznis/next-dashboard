export interface IOrganization {
  id?: string;

  organizationId?: string;

  logoUrl?: string;

  title?: string;

  status?: string;
}

export interface ICountry {
  countryCode?: string;

  countruName?: string;

  continent?: string;
}

export interface ILocation {
  locationId?: string;

  organizationId?: string;

  name?: string;

  country?: ICountry;
}
