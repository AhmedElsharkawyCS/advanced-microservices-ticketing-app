import * as React from "react"
import { useRouter } from "next/router"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import InfoIcon from "@mui/icons-material/Info"
import IconButton from "@mui/material/IconButton"
import DataGrid from "@components/DataGrid"
import Box from "@mui/material/Box"

export default function Orders({ orders }) {
  const { push } = useRouter()
  const actionCell = ({ row }) => {
    const onClick = (e) => {
      e.stopPropagation()
      push(`/orders/${row.id}`)
    }
    return (
      <IconButton aria-label='info' size='medium' onClick={onClick}>
        <InfoIcon fontSize='inherit' />
      </IconButton>
    )
  }
  const columns = [
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      editable: false,
      valueFormatter: ({ value }) => value.toUpperCase(),
    },
    {
      field: "expireAt",
      headerName: "Expire After",
      flex: 0.2,
      editable: false,
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
    },
    {
      field: "ticket.price",
      headerName: "Ticket Price",
      flex: 0.2,
      editable: false,
      valueGetter: ({ row }) => row.ticket.price + " $",
    },
    {
      field: "ticket.title",
      headerName: "Ticket Name",
      flex: 0.2,
      editable: false,
      valueGetter: ({ row }) => row.ticket.title,
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
          Orders
        </Typography>
      </Box>
      <Box sx={{ my: 4, height: 400, width: "100%", display: "flex", alignItems: "center" }}>
        <DataGrid showToolbar columns={columns} rows={orders} />
      </Box>
    </Container>
  )
}

Orders.getInitialProps = async ({ req }, { apiCall }) => {
  try {
    const { data } = await apiCall.get("/api/orders")
    return { orders: data }
  } catch (error) {
    if (error?.response?.status == 404) {
      return { orders: [] }
    }
    return {}
  }
}
