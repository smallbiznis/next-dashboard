import { IOption } from "@/types/product"
import { useState } from "react"

interface VariantProps {
  variants: any[]
}

export default function Variants({
  variants
}:VariantProps) {

  const [vars, setVars] = useState(variants)

  return (
    <div>
      {vars.map((variant) => {
        return (<div>{variant.toString()}</div>)
      })}
    </div>
  )
}