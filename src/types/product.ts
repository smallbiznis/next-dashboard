
export interface IResource {

  imgUrl: string

  variantIds: string[]

}

export interface IProduct {

  id?: string

  resources: IResource[]

  slug?: string

  title?: string

  bodyHtml?: string

  status?: string

}