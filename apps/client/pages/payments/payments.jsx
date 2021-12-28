import * as React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import DataGrid from "@components/DataGrid"
import Box from "@mui/material/Box"

export default function Payments({ payments }) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
      editable: false,
    },
    {
      field: "status",
      headerName: "Payment Status",
      flex: 0.2,
      editable: false,
      valueFormatter: ({ value }) => value.toUpperCase(),
    },
    {
      field: "order.price",
      headerName: "Amount",
      flex: 0.2,
      editable: false,
      valueGetter: ({ row }) => row.order.price + " $",
    },
  ]
  return (
    <Container maxWidth='xl'>
      <Box sx={{ my: 4, mb: 0, display: "flex", justifyContent: "space-between" }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Payment History
        </Typography>
      </Box>
      <Box sx={{ my: 4, height: 400, width: "100%", display: "flex", alignItems: "center" }}>
        <DataGrid showToolbar columns={columns} rows={payments} />
      </Box>
    </Container>
  )
}

Payments.getInitialProps = async (_, { apiCall }) => {
  try {
    const { data } = await apiCall.get("/api/payments")
    return { payments: data }
  } catch (error) {
    if (error?.response?.status == 404) {
      return { orders: [] }
    }
    return {}
  }
}
