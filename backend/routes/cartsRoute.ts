import { Router } from "express";
import {
  cart_get,
  cart_post,
  cart_delete,
} from "../controllers/cartsController";
const router = Router();

router.get("/cart", cart_get);
router.post("/cart", cart_post);
router.delete("/cart", cart_delete);

export default router;
