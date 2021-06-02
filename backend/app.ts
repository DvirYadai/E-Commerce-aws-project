import express from "express";
import itemsRouter from "./routes/itemsRoute";
import cartsRouter from "./routes/cartsRoute";
import ordersRouter from "./routes/ordersRoute";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", itemsRouter);
app.use("/api/v1", cartsRouter);
app.use("/api/v1", ordersRouter);

export default app;
