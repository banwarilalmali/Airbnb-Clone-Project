import express from "express";
import {
  signupUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/logout", logoutUser);

export default router;