import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API Controller function to manage clerk User with database
// https://localhost:4000/api/user/webhooks
const clerkWebHooks = async (req, res) => {
   try {
      // create a Svix instance with clerk Webhook secrets
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      await whook.verify(JSON.stringify(req.body), {
         "svix-id": req.headers["svix-id"],
         "svix-timestamp": req.headers["svix-timestamp"],
         "svix-signature": req.headers["svix-signature"],
      });

      const { data, type } = req.body;

      switch (type) {
         case "user.created": {
            const userData = {
               clerkId: data.id,
               email: data.email_addresses[0].email_address,
               firstName: data.first_name,
               lastName: data.last_name,
               photo: data.image_url,
            };

            await userModel.create(userData);
            res.json({});

            break;
         }

         case "user.updated": {
            const userData = {
               email: data.email_addresses[0].email_address,
               firstName: data.first_name,
               lastName: data.last_name,
               photo: data.image_url,
            };

            await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
            res.json({});

            break;
         }

         case "user.deleted": {
            await userModel.findOneAndDelete({ clerkId: data.id });
            res.json({});
            break;
         }

         default:
            break;
      }
   } catch (error) {
      console.log(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

// API Controller fuction to get user available credits data

const userCredit = async (req, res) => {
   try {
      const { clerkId } = req.body;

      const userData = await userModel.findOne({ clerkId });

      res.json({
         success: true,
         credits: userData.creditBalance,
      });
   } catch (error) {
      console.log(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};

//API to make payment credits (Stripe)
const paymentStripe = async (req, res) => {
   try {
      const { clerkId, planId } = req.body;

      const userData = await userModel.findOne({ clerkId });

      if (!userData || !planId) {
         return res.json({
            success: false,
            message: "Invalid Credentials",
         });
      }

      let credits, plan, amount;

      // Determine the plan details based on planId
      switch (planId) {
         case "Basic":
            plan = "Basic";
            credits = 100;
            amount = 10; // in dollars
            break;

         case "Advanced":
            plan = "Advanced";
            credits = 500;
            amount = 50; // in dollars
            break;

         case "Business":
            plan = "Business";
            credits = 5000;
            amount = 250; // in dollars
            break;

         default:
            return res.json({
               success: false,
               message: "Invalid Plan ID",
            });
      }

      const date = Date.now();

      // Creating transaction record
      const transactionData = {
         clerkId,
         plan,
         credits,
         amount,
         date,
      };

      const newTransaction = await transactionModel.create(transactionData);

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
         amount: amount * 100, // Convert to cents
         currency: "usd",
         receipt_email: userData.email, // Optional: Store user email for receipt
         metadata: { transactionId: newTransaction._id.toString() }, // Link to transaction
      });

      // Return the client secret to the frontend
      res.json({
         success: true,
         clientSecret: paymentIntent.client_secret,
         transactionId: newTransaction._id,
      });
   } catch (error) {
      console.log(error.message);
      res.json({
         success: false,
         message: error.message,
      });
   }
};
export { clerkWebHooks, userCredit, paymentStripe };
