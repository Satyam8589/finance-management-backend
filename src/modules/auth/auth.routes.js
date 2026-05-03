import { Router } from "express";
import { register, login, refresh, logout, logoutAll } from "./auth.controller.js";
import { validate, registerSchema, loginSchema, refreshSchema } from "./auth.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);

router.post("/logout", logout);
router.post("/logout-all", authenticate, logoutAll);

export default router;