import React, { useState, useEffect } from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Form from "@components/Form"
import { useRouter } from "next/router"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Grid from "@mui/material/Grid"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import TitleIcon from "@mui/icons-material/TitleTwoTone"
import LinkIcon from "@mui/icons-material/Link"
import { TextInput } from "@components/Inputs"
import { LoadingButton, Button } from "@components/Buttons"
import { Typography } from "@mui/material"
import ErrorAlert from "@components/Error"
import { useRequest } from "@hooks"

export default function TicketInfo({ ticket }) {
  const { push } = useRouter()
  const [isEditable, setIsEditable] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState(0)
  const { doRequest, errors, loading, resetError } = useRequest({
    method: "put",
    url: `/api/tickets/${ticket?.id}`,
    onSuccess: () => {
      setIsEditable(false)
    },
  })
  useEffect(() => {
    if (ticket) {
      setPrice(ticket.price)
      setTitle(ticket.title)
    }
  }, [ticket])

  const onSubmit = (event) => {
    event.preventDefault()
    doRequest({ title, price })
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
          View or Edit a ticket!
        </Typography>
        {ticket ? (
          <Form onSubmit={onSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={3} sx={{ padding: "0 50px 40px 50px" }}>
              <Grid item xs={12}>
                <TextInput
                  name='title'
                  type='text'
                  required
                  disabled={!isEditable}
                  placeholder='Title'
                  label='Title'
                  fullWidth
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    resetError()
                  }}
                  error={!title}
                  helperText={!title && "Ticket title is required"}
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
                  disabled={!isEditable}
                  value={price}
                  required={isNaN(price) || price < 1}
                  InputProps={{ startAdornment: <AttachMoneyIcon /> }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setPrice(Number(e.target.value) || e.target.value)
                    resetError()
                  }}
                  error={isNaN(price) || price < 1}
                  helperText={(isNaN(price) || price < 1) && "Ticket price is required"}
                />
              </Grid>
              <ErrorAlert errors={errors} isGrid xs={12} />
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} display='flex' justifyContent={"space-between"}>
                    {isEditable ? (
                      <>
                        <Button
                          endIcon={<CancelIcon />}
                          sx={{ maxWidth: "120px", marginInlineEnd: "5px" }}
                          onClick={() => {
                            setIsEditable(false)
                            resetError()
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton type='submit' fullWidth loading={loading} sx={{ maxWidth: "150px" }}>
                          Save
                        </LoadingButton>
                      </>
                    ) : (
                      <>
                        <Button
                          endIcon={<EditIcon />}
                          sx={{ maxWidth: "150px" }}
                          onClick={() => {
                            setIsEditable(true)
                            resetError()
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='outlined'
                          endIcon={<LinkIcon />}
                          sx={{ maxWidth: "200px" }}
                          onClick={() => {
                            push(`/orders/create/${ticket.id}`)
                          }}
                        >
                          Click to purchase
                        </Button>
                      </>
                    )}
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
