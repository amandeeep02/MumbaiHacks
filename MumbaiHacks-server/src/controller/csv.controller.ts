import { Request, Response } from "express";
import { IncomeModel } from "../models/income.model";
import { ExpenseModel } from "../models/expense.model";
import { parse } from "json2csv";

export const generateCSV = async (req: Request, res: Response) => {
  try {
    const incomes = await IncomeModel.find().lean();
    const expenses = await ExpenseModel.find().lean();

    const data = [...incomes, ...expenses].map((item, index) => ({
      "Sr. No": index + 1,
      Date: item.date.toISOString().split("T")[0],
      "Organization ID": item.organizationId,
      Amount: item.amount,
      Description: item.description || "",
      "Payment Method": item.paymentMethod,
      Tags: item.tags ? item.tags.join(", ") : "",
      "Created By (ID)": item.createdBy,
      "Payee Type": item.payeeType,
      "Payee ID": item.payeeId,
    }));

    const csv = parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    return res.status(500).send("Internal Server Error");
  }
};


