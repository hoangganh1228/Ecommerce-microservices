import { Router } from "express";
import {  updateProfile } from "../controllers/user.controller";

const router = Router();

router.post("/profile", updateProfile);

export default router;