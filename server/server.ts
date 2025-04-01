import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose'; 
import configRoutes from "./routes/configRoutes";
import dataRoutes from "./routes/dataRoutes";
import healthRoutes from "./routes/healthRoutes";
import chatRoutes from "./routes/chatRoutes";
import * as admin from 'firebase-admin'; 

dotenv.config();

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountPath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set.');
  }
  const serviceAccount = require(serviceAccountPath); 

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
  process.exit(1);
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable not set.');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error("Error connecting to MongoDB:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};
connectDB(); 

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy - required for Render
app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://lambda-lens.vercel.app" 
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/config", configRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

// Basic health check endpoint for Render
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use((_req: Request, res: Response) => {
  return res.status(404).send("This is not the page you're looking for");
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };

  if (err.message?.includes("credentials")) {
    defaultErr.message.err =
      "AWS credentials are not configured. Please configure them in the settings page.";
  }

  const errorObj = Object.assign({}, defaultErr, err);
  console.error(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start server only after DB connection attempt (handled by process.exit on failure)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
