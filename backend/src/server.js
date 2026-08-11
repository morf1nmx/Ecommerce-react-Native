import express from "express";
const app = express();
app.get("/api/ecommerce", (req, res) => {
  res.status(200).json({ message: "Success" });
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
