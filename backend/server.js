const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/authRoutes");
const friendRoutes = require("./Routes/friendRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// Use CORS to allow requests from frontend (React)
app.use(
  cors({
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
