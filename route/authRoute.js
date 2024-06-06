import express from "express";
import { signUp } from "../controller/authController";

const router = express.Router(); // Use ES6 import for express.Router()

router.route("/signup").post(signUp);

export default router; 
