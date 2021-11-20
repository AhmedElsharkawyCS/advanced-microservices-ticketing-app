import * as React from "react"
import Button from "@mui/material/Button"
export default function MUIButton({ children, ...props }) {
  return (
    <Button variant='contained' {...props}>
      {children}
    </Button>
  )
}
