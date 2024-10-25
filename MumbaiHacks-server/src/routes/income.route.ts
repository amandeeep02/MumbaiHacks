import { Router } from "express";
import {
    getAllIncomes,
    getAllIncomesByOrganization,
    getAllIncomesByOrganizationBetweenDates,
    getIncome,
    createIncome,
    updateIncome
} from "../controller/income.controller";

const router = Router();

router.route("/")
    .get(getAllIncomes)
    .post(createIncome);

router.route("/organization")
    .post(getAllIncomesByOrganization);

router.route("/organization/dates")
    .post(getAllIncomesByOrganizationBetweenDates);

router.route("/income")
    .post(getIncome)
    .patch(updateIncome);

export default router;