import React from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Form from "@components/Form"
import { useRouter } from "next/router"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Grid from "@mui/material/Grid"
import { TextInput } from "@components/Inputs"
import LinkIcon from "@mui/icons-material/Link"
import { LoadingButton, Button } from "@components/Buttons"
import { Typography } from "@mui/material"
import ErrorAlert from "@components/Error"
import { useRequest } from "@hooks"

export default function OrderInfo({ order }) {
  const { push } = useRouter()
  const { doRequest, errors, loading } = useRequest({
    method: "delete",
    url: `/api/orders/${order?.id}`,
    onSuccess: () => {
      push("/orders")
    },
  })

  const onSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }

  return (
    <Container maxWidth='xl' sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          width: "500px",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom sx={{ padding: "20px" }}>
          Cancel or view an order!
        </Typography>
        {order ? (
          <Form onSubmit={onSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={3} sx={{ padding: "0 50px 40px 50px" }}>
              <Grid item xs={12}>
                <TextInput
                  name='status'
                  type='text'
                  required
                  disabled={true}
                  placeholder='Order status'
                  label='Order status'
                  fullWidth
                  value={order.status}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='expireAt'
                  type='text'
                  required
                  disabled={true}
                  placeholder='Order expire at'
                  label='Order expire at'
                  fullWidth
                  value={new Date(order.expireAt).toLocaleString()}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='price'
                  type='number'
                  placeholder='Ticket Price'
                  label='Ticket Price'
                  fullWidth
                  disabled={true}
                  value={order.ticket.price}
                  InputProps={{ startAdornment: <AttachMoneyIcon /> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='title'
                  type='text'
                  required
                  disabled={true}
                  placeholder='Ticket Title'
                  label='Ticket Title'
                  fullWidth
                  value={order.ticket.title}
                />
              </Grid>
              <ErrorAlert errors={errors} isGrid xs={12} />
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} display='flex' justifyContent={"space-between"}>
                    <LoadingButton type='submit' color='error' fullWidth loading={loading} sx={{ maxWidth: "150px" }}>
                      Cancel order
                    </LoadingButton>
                    <Button variant='outlined' endIcon={<LinkIcon />} sx={{ maxWidth: "200px" }} onClick={() => push(`/payments/orders/${order.id}`)}>
                      Purchase Order
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        ) : (
          <ErrorAlert sx={{ mb: "20px" }} errors={[{ message: "Sorry, order not exist anymore" }]} />
        )}
      </Paper>
    </Container>
  )
}

OrderInfo.getInitialProps = async ({ query }, { apiCall }) => {
  try {
    const { data } = await apiCall.get(`/api/orders/${query.orderId}`)
    return { order: data }
  } catch (error) {
    return {}
  }
}
