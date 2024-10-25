import { Router } from "express";
import { getAllExpenses, getAllExpensesByOrganization, getAllExpensesByOrganizationBetweenDates, getExpense, createExpense, updateExpense } from "../controller/expense.controller";

const router = Router();

router.route("/")
  .get(getAllExpenses) // for testing onlyyyyyyyyyyyyyyyyyy
  .post(createExpense);

router.route("/organization")
  .post(getAllExpensesByOrganization);

router.route("/organization/dates")
  .post(getAllExpensesByOrganizationBetweenDates);

router.route("/expense")
  .post(getExpense)
  .patch(updateExpense);

export default router;

// params ki mkc sab body me do