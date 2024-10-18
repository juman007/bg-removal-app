import mongoose from "mongoose";

const connectDB = async () => {
   try {
      // Handle events like successful connection and disconnection
      mongoose.connection.on("connected", () =>
         console.log("Database Connected")
      );
      mongoose.connection.on("error", (err) =>
         console.error("Database Connection Error:", err)
      );
      mongoose.connection.on("disconnected", () =>
         console.log("Database Disconnected")
      );

      // Establish the connection
      await mongoose.connect(`${process.env.MONGODB_URI}/bg-removal`, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      console.log("MongoDB connection established successfully.");
   } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1); // Exit with failure if connection fails
   }
};

export default connectDB;
