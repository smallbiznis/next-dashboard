export interface IResource {
  imgUrl: string;

  variantIds: string[];
}

export interface IOption {
  optionId?: string;

  optionName: string;

  optionValues: string[];
}

export interface IVariant {
  variantId?: string;

  productId?: string;

  sku?: string;

  title?: string;

  price?: number;

  cost?: number;

  attributes: string[];

  inventoryItems?: IInventoryItem[];
}

export interface IInventoryItem {
  inventoryItemId?: string;

  organizationId?: string;

  locationId?: string;

  variantId?: string;

  totalStock?: number;

  reservedStock?: number;

  reorderStock?: number;
}

export interface IProduct {
  id?: string;

  slug?: string;

  title?: string;

  bodyHtml?: string;

  options?: IOption[];

  variants?: IVariant[];

  status?: string;
}
