import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Avatar from "@mui/material/Avatar"
import LogoutIcon from "@mui/icons-material/Logout"
import HomeIcon from "@mui/icons-material/Home"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import HistoryIcon from "@mui/icons-material/History"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import { useRouter } from "next/router"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useRequest } from "@hooks"

export default function Header({ currentUser }) {
  const { push } = useRouter()
  const isMobile = useMediaQuery("(max-width:700px)")
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant='h6' component='div' sx={{ width: "fit-content", cursor: "pointer" }} onClick={() => push("/")}>
            Ticketing
          </Typography>

          {currentUser ? (
            <Box sx={{ display: "flex" }}>
              {!isMobile && <Links push={push} />}
              <AuthenticatedUser push={push} currentUser={currentUser} />
            </Box>
          ) : (
            <Button color='inherit' onClick={() => push("/auth/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
function Links({ push }) {
  return (
    <>
      <Button sx={{ marginInlineEnd: "10px" }} color='inherit' onClick={() => push("/tickets")}>
        Sell Tickets
      </Button>
      <Button sx={{ marginInlineEnd: "10px" }} color='inherit' onClick={() => push("/payments")}>
        Payment history
      </Button>
      <Button sx={{ marginInlineEnd: "50px" }} color='inherit' onClick={() => push("/orders")}>
        My Orders
      </Button>
    </>
  )
}

function AuthenticatedUser({ push, currentUser }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMobile = useMediaQuery("(max-width:700px)")
  const { doRequest } = useRequest({ method: "post", onSuccess: () => push("/"), url: "/api/users/signout" })
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const signOut = () => {
    doRequest()
  }
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title='User Menu'>
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <Avatar>{(currentUser?.email || "Avatar").toUpperCase().charAt(0)}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 150,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          key={"0"}
          onClick={(e) => {
            handleCloseMenu()
            push("/")
          }}
        >
          <ListItemIcon>
            <HomeIcon fontSize='small' />
          </ListItemIcon>
          Home
        </MenuItem>
        {isMobile && (
          <>
            <MenuItem
              key={"2"}
              onClick={(e) => {
                handleCloseMenu()
                push("/tickets")
              }}
            >
              <ListItemIcon>
                <ConfirmationNumberIcon fontSize='small' />
              </ListItemIcon>
              Sell Tickets
            </MenuItem>
            <MenuItem
              key={"3"}
              onClick={(e) => {
                handleCloseMenu()
                push("/orders")
              }}
            >
              <ListItemIcon>
                <AddShoppingCartIcon fontSize='small' />
              </ListItemIcon>
              My Orders
            </MenuItem>
            <MenuItem
              key={"4"}
              onClick={(e) => {
                handleCloseMenu()
                push("/payments")
              }}
            >
              <ListItemIcon>
                <HistoryIcon fontSize='small' />
              </ListItemIcon>
              Payment History
            </MenuItem>
          </>
        )}
        <MenuItem
          key={"5"}
          onClick={() => {
            handleCloseMenu()
            signOut()
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
