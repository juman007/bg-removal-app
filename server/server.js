import express from "express";
import "dotenv/config";
import cors from "cors";
import { connect } from "react-redux";
import connectDB from "./config/mongodb.js";

// APP config
const port = process.env.PORT || 4000;
const app = express();

// Initialize Middleware
app.use(express.json());
app.use(cors());
await connectDB();

// API routes
app.get("/", (req, res) => {
   res.send("API Working");
});

app.listen(port, () => console.log("server running on " + port));
