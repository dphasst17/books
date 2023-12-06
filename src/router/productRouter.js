import * as productController from "../controllers/productController.js";
import express from "express"
const router = express.Router()

router.get('/api/product/:currentPages?/:limit?',productController.index)
router.get('/api/add/product',productController.add)
router.get('/api/detail/product/:isbn',productController.detail)
router.get('/api/new/product',productController.getNew)
//Views
router.get('/product',productController.viewProduct)
router.get('/admin/product',productController.viewProduct)
router.get('/detail/product/:isbn',productController.viewDetail)
export default router