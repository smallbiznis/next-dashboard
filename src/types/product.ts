
export interface IResource {

  imgUrl: string

  variantIds: string[]

}

export interface IOption {

  optionId?: string

  optionName: string

  optionValues: string[]

}

export interface IVariant {

  variantId?: string

  productId?: string

  sku?: string

  title?: string

  price?: number

  cost?: number

  attributes?: string[]

}

export interface IProduct {

  id?: string

  slug?: string

  title?: string

  bodyHtml?: string

  options?: IOption[]

  status?: string

}