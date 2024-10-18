import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";

async function startServer() {
   // APP config
   const port = process.env.PORT || 4000;
   const app = express();

   // Initialize Middleware
   app.use(express.json());
   app.use(cors());

   // Connect to the database
   await connectDB();

   // API routes
   app.get("/", (req, res) => {
      res.send("API Working");
   });
   app.use("/api/user", userRouter);

   // Start the server
   app.listen(port, () => console.log("Server running on port " + port));
}

// Call the async function to start the server
startServer().catch((err) => {
   console.error("Error starting the server:", err);
});
