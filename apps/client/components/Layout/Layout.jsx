import React from "react"
import Header from "../Header/Header"

export default function Layout({ children, currentUser }) {
  return (
    <React.Fragment>
      <Header currentUser={currentUser} />
      <main>{children}</main>
    </React.Fragment>
  )
}
