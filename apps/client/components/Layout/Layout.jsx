import React from "react"
import Header from "./Header"

export default function Layout({ children, user }) {
  return (
    <React.Fragment>
      <Header user={user} />
      <main>{children}</main>
    </React.Fragment>
  )
}
