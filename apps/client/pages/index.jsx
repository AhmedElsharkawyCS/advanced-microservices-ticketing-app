import * as React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import ProTip from "@components/ProTip"
import Link from "@components/Link"
import Copyright from "@components/Copyright"

export default function Index() {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4, display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Welcome to Ticketing application
        </Typography>
        <Link href='/auth/register' color='primary'>
          Go to the register page
        </Link>
        <Link href='/auth/login' color='primary'>
          Go to the login page
        </Link>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}
