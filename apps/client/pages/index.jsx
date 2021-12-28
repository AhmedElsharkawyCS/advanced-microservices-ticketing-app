import * as React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import ProTip from "@components/ProTip"
import Link from "@components/Link"
import Copyright from "@components/Copyright"

function LandingLinks({ user }) {
  if (user) {
    return (
      <>
        <Link href='/orders' color='primary'>
          Go to the orders page
        </Link>
        <Link href='/tickets' color='primary'>
          Go to the tickets page
        </Link>
      </>
    )
  }
  return (
    <>
      <Link href='/auth/register' color='primary'>
        Go to the register page
      </Link>
      <Link href='/auth/login' color='primary'>
        Go to the login page
      </Link>
    </>
  )
}
export default function LandingPage({ currentUser }) {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4, display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Typography variant='h4' component='h1' gutterBottom>
          {`Welcome ${currentUser ? currentUser.email : "to Ticketing application"}`}
        </Typography>
        <LandingLinks user={currentUser} />
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}

LandingPage.getInitialProps = async (_, { currentUser }) => {
  return { currentUser }
}
