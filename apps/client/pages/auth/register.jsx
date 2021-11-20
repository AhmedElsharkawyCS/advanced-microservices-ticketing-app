import React, { useState } from "react"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Form from "@components/Form"
import Grid from "@mui/material/Grid"
import Link from "@components/Link"
import ErrorAlert from "@components/Error"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import PasswordIcon from "@mui/icons-material/Password"
import { TextInput } from "@components/Inputs"
import { LoadingButton } from "@components/Buttons"
import { Typography } from "@mui/material"
import { useRequest } from "@hooks"

export default function Register() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const { doRequest, errors, loading, resetError } = useRequest({ method: "post", url: "/api/users/signup" })
  const onSubmit = (event) => {
    event.preventDefault()
    doRequest({ email, password })
  }
  return (
    <Container maxWidth='xl' sx={{ display: "flex", justifyContent: "center", height: "100vh" }}>
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
          Register Now
        </Typography>
        <Form onSubmit={onSubmit} sx={{ width: "100%" }}>
          <Grid container spacing={3} sx={{ padding: "0 50px 40px 50px" }}>
            <Grid item xs={12}>
              <TextInput
                name='email'
                type='email'
                required
                placeholder='Email'
                label='Email'
                fullWidth
                onChange={(e) => {
                  setEmail(e.target.value)
                  resetError()
                }}
                error={!email}
                helperText={!email && "Email address is required"}
                InputProps={{
                  endAdornment: <AlternateEmailIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                name='password'
                type='password'
                required
                placeholder='Password'
                label='Password'
                fullWidth
                onChange={(e) => {
                  setPassword(e.target.value)
                  resetError()
                }}
                error={!password}
                helperText={!password && "Password is required"}
                InputProps={{
                  endAdornment: <PasswordIcon />,
                }}
              />
            </Grid>
            <ErrorAlert errors={errors} isGrid xs={12} />
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12} display='flex' justifyContent='center'>
                  <LoadingButton type='submit' fullWidth loading={loading} sx={{ maxWidth: "150px" }}>
                    Sign Up
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent='center'>
                  <span> If you already have an account try to</span>
                  &nbsp;
                  <Link href='/auth/login' color='primary'>
                    Login
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Container>
  )
}
