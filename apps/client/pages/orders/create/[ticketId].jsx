import React from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Form from "@components/Form"
import { useRouter } from "next/router"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Grid from "@mui/material/Grid"
import TitleIcon from "@mui/icons-material/TitleTwoTone"
import { TextInput } from "@components/Inputs"
import { LoadingButton } from "@components/Buttons"
import { Typography } from "@mui/material"
import ErrorAlert from "@components/Error"
import { useRequest } from "@hooks"

export default function TicketInfo({ ticket }) {
  const { push } = useRouter()
  const { doRequest, errors, loading } = useRequest({
    method: "post",
    url: `/api/orders`,
    onSuccess: (res) => {
      push(`/payments/orders/${res.id}`)
    },
  })
  const onSubmit = (event) => {
    event.preventDefault()
    doRequest({ ticketId: ticket.id })
  }

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
          Order a ticket!
        </Typography>
        {ticket ? (
          <Form onSubmit={onSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={3} sx={{ padding: "0 50px 40px 50px" }}>
              <Grid item xs={12}>
                <TextInput
                  name='title'
                  type='text'
                  required
                  disabled={true}
                  placeholder='Title'
                  label='Title'
                  fullWidth
                  value={ticket.title}
                  InputProps={{
                    endAdornment: <TitleIcon />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name='price'
                  type='number'
                  placeholder='Price'
                  label='Price'
                  fullWidth
                  disabled={true}
                  value={ticket.price}
                  InputProps={{ startAdornment: <AttachMoneyIcon /> }}
                />
              </Grid>
              <ErrorAlert errors={errors} isGrid xs={12} />
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} display='flex' justifyContent={"center"}>
                    <LoadingButton type='submit' fullWidth loading={loading} sx={{ maxWidth: "150px" }}>
                      Purchase
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        ) : (
          <ErrorAlert sx={{ mb: "20px" }} errors={[{ message: "Sorry, ticket not exist anymore" }]} />
        )}
      </Paper>
    </Container>
  )
}

TicketInfo.getInitialProps = async ({ query }, { apiCall }) => {
  try {
    const { data } = await apiCall.get(`/api/tickets/${query.ticketId}`)
    return { ticket: data }
  } catch (error) {
    return {}
  }
}
