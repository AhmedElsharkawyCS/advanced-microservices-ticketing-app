import * as React from "react"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
export default function Form({ children, onSubmit, ...rest }) {
  return (
    <Box component='form' autoComplete='off' onSubmit={onSubmit} {...rest}>
      <FormControl>{children}</FormControl>
    </Box>
  )
}
