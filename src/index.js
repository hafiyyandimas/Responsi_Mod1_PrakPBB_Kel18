import express from "express";
import dotenv from "dotenv";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Library Loan API berjalan",
    endpoints: ["GET /loans", "GET /loans/:id", "POST /loans", "PUT /loans/:id", "DELETE /loans/:id"],
  });
});

app.use("/loans", loanRoutes);

// Body JSON yang rusak / route tidak ada
app.use((req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan" }));
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Body JSON tidak valid" });
  }
  res.status(500).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
