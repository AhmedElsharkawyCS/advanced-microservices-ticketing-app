import * as React from "react"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Link from "@components/Link"
export default function Custom404() {
  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4, display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Typography variant='h4' component='h1' gutterBottom>
          404 - Page Not Found
        </Typography>
        <Link href='/' color='primary'>
          Home page
        </Link>
      </Box>
    </Container>
  )
}
