import express, { json } from "express";
const app = express();

app.use(json());
app.get("/api/users/me", (req, res, next) => {
  res.send("Hi there!");
});
app.listen(3000, () => {
  console.log("Listing on port: 3000");
});
