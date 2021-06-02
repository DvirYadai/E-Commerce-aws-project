import { Router } from "express";
import order_post from "../controllers/ordersController";
const router = Router();

router.post("/order", order_post);

export default router;
