import * as React from "react"
import { useRouter } from "next/router"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import InfoIcon from "@mui/icons-material/Info"
import IconButton from "@mui/material/IconButton"
import { Button } from "@components/Buttons"
import DataGrid from "@components/DataGrid"
import Box from "@mui/material/Box"

export default function Tickets({ tickets }) {
  const { push } = useRouter()
  const actionCell = ({ row }) => {
    const onClick = (e) => {
      e.stopPropagation()
      push(`/tickets/${row.id}`)
    }
    return (
      <IconButton aria-label='info' size='medium' onClick={onClick}>
        <InfoIcon fontSize='inherit' />
      </IconButton>
    )
  }
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.25,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.3,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      valueFormatter: ({ value }) => `${value} $`,
      flex: 0.25,
      editable: false,
    },
    {
      field: "action",
      headerName: "action",
      flex: 0.2,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: actionCell,
    },
  ]
  return (
    <Container maxWidth='xl'>
      <Box sx={{ my: 4, mb: 0, display: "flex", justifyContent: "space-between" }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Tickets
        </Typography>
        <Button onClick={() => push("/tickets/create")}>
          <span>Add new ticket </span>
          <ArrowForwardIcon />
        </Button>
      </Box>
      <Box sx={{ my: 4, height: 400, width: "100%", display: "flex", alignItems: "center" }}>
        <DataGrid showToolbar columns={columns} rows={tickets} />
      </Box>
    </Container>
  )
}

Tickets.getInitialProps = async ({ req }, { apiCall }) => {
  try {
    const { data } = await apiCall.get("/api/tickets")
    return { tickets: data }
  } catch (error) {
    if (error?.response?.status == 404) {
      return { tickets: [] }
    }
    return {}
  }
}
