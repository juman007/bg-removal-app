import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";

// Controller function to remove background from image
const removeBgImage = async (req, res) => {
   try {
      // Get user's clerkId from request body
      const { clerkId } = req.body;

      // Find the user by clerkId
      const user = await userModel.findOne({ clerkId });

      if (!user) {
         return res.json({
            success: false,
            message: "User not found",
         });
      }

      if (user.creditBalance === 0) {
         return res.json({
            success: false,
            message: "No Credit Balance",
            creditBalance: user.creditBalance,
         });
      }

      const imagePath = req.file.path;

      // Reading the image file
      const imageFile = fs.createReadStream(imagePath);

      const formData = new FormData();
      formData.append("image_file", imageFile);

      // Making the API request to remove the background
      const { data } = await axios.post(
         "https://clipdrop-api.co/remove-background/v1",
         formData,
         {
            headers: {
               "x-api-key": process.env.CLIPDROP_API,
            },
            responseType: "arraybuffer",
         }
      );

      // Convert the data to base64
      const base64Image = Buffer.from(data, "binary").toString("base64");
      const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;

      // Update the user's credit balance
      await userModel.findByIdAndUpdate(user._id, {
         creditBalance: user.creditBalance - 1,
      });

      // Send the response with the result image
      res.json({
         success: true,
         resultImage,
         creditBalance: user.creditBalance - 1,
         message: "Background Removed",
      });
   } catch (error) {
      console.log(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

export { removeBgImage };
