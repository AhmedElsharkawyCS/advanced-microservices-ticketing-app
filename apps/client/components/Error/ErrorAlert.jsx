import React from "react"
import Alert from "@mui/material/Alert"
import Grid from "@mui/material/Grid"

export default function ErrorAlert({ errors, isGrid, xs, sx }) {
  if (!errors || errors?.length <= 0) return null
  const [error] = errors
  if (isGrid)
    return (
      <Grid xs={xs} item sx={sx}>
        <Alert severity='error'>{error.message}</Alert>
      </Grid>
    )
  return (
    <Alert severity='error' sx={sx}>
      {error.message}
    </Alert>
  )
}
