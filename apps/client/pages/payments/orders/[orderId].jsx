import React, { useState, useEffect } from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Form from "@components/Form"
import { useRouter } from "next/router"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Grid from "@mui/material/Grid"
import { TextInput } from "@components/Inputs"
import { Typography } from "@mui/material"
import ErrorAlert from "@components/Error"
import Chip from "@mui/material/Chip"
import StripeButton from "@components/StripeButton"
import { useRequest } from "@hooks"
import { timerDown } from "@utils"

export default function OrderInfo({ order, currentUser }) {
  const { push } = useRouter()
  const [timer, setTimer] = useState({})
  const { doRequest, errors } = useRequest({
    method: "post",
    url: `/api/payments`,
    onSuccess: () => {
      push("/payments")
    },
  })

  const onSubmit = (token) => {
    doRequest({
      orderId: order.id,
      token: token,
    })
  }
  useEffect(() => {
    setTimer(timerDown(order?.expireAt))
    const interval = setInterval(() => {
      setTimer(timerDown(order?.expireAt))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Container maxWidth='xl' sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <Paper
        elevation={3}
        sx={{
          width: "450px",
          height: "fit-content",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom sx={{ padding: "20px" }}>
          Purchase an order!
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
                  <Grid item xs={12} display='flex' justifyContent={"center"}>
                    <Chip color='info' label={timer.isTimeUp ? "Order has been expired" : `Will expire after: ${timer.minutes}m ${timer.seconds}s`} />
                  </Grid>
                  <Grid item xs={12} display='flex' justifyContent={"center"}>
                    <StripeButton
                      user={currentUser}
                      amountInCents={order.ticket.price * 100}
                      disabled={timer.isTimeUp}
                      onSubmit={(payload) => onSubmit(payload.id)}
                    />
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
