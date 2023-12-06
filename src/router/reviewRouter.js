import * as reviewController from "../controllers/reviewController.js";
import { verify } from "../middleware/index.js";
import express from "express"
const router = express.Router();

router.post('/insert',verify,reviewController.insert)
router.get('/',reviewController.getAll)
router.get('/detail/:idBooks',reviewController.getReviewByIdBooks)
export default router