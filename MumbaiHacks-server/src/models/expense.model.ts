import { IExpense } from "../Interfaces/expense.interface";
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema<IExpense>({
        organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        date: { type: Date, required: true },
        paymentMethod: { type: String, required: true },
        tags: [{ type: String }],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        payeeType: { type: String, required: true },
        payeeId: { type: mongoose.Schema.Types.ObjectId, required: true }
    });

    export const ExpenseModel = mongoose.model<IExpense>('Expense', expenseSchema);