import { Router } from "express";
import { configController } from "../controllers/ConfigController";

const router = Router();

router.post("/save", configController.saveConfiguration, (_req, res) => {
  res.status(200).json({ message: res.locals.saved });
});

router.get("/db", configController.connectDatabase, (_req, res) => {
  res.status(200).json({ message: "Database connection established" });
});

router.post("/db", configController.connectDatabase, (_req, res) => {
  res.status(200).json({ message: "Database connection established" });
});

router.use((err: any, _req: any, res: any, next: any) => {
  if (err) {
    return res.status(err.status || 500).json({
      message: { err: err.message?.err || err.message || "An error occurred" },
    });
  }
  next();
});

export default router;
