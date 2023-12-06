import * as authController from "../controllers/authController.js";
import express from "express"
const router = express.Router()
router.post('/login',authController.login);
router.post('/admin/login',authController.adminLogin);
router.post('/register',authController.registerUser);
router.post('/token',authController.token);
export default router;