import { Router } from "express";
import { generateCSV } from "../controller/csv.controller";

const router = Router();

router.get("/download-csv", generateCSV);

export default router;
