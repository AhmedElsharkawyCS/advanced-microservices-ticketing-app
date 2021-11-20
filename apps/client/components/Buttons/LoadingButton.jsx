import * as React from "react"
import LoadingButton from "@mui/lab/LoadingButton"
export default function MUILoadingButton({ children, ...props }) {
  return (
    <LoadingButton variant='contained' {...props}>
      {children}
    </LoadingButton>
  )
}
