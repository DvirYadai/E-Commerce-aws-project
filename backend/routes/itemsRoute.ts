import { Router } from "express";
import items_get from "../controllers/itemsController";
const router = Router();

router.get("/items", items_get);

export default router;
