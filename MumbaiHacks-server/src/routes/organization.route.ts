import { Router } from "express";
import { addOrganization, addEmployee } from "../controller/organization.controller";

const router = Router();

// Route to add a new organization
router.post("/add", addOrganization);

// Route to add an employee to an organization
router.post("/add-employee", addEmployee);

export default router;