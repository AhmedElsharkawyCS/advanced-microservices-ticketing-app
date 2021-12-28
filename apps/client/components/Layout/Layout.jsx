import React from "react"
import Header from "../Header/Header"

export default function Layout({ children, currentUser }) {
  return (
    <React.Fragment>
      <Header currentUser={currentUser} />
      <main style={{ minWidth: "470px", overflowX: "auto" }}>{children}</main>
    </React.Fragment>
  )
}
