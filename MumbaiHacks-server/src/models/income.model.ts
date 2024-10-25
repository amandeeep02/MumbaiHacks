import mongoose, { ObjectId } from "mongoose";
import { IIncome } from "../Interfaces/income.interface";

const incomeSchema = new mongoose.Schema<IIncome>({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Organization",
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Bank Transfer'],
        required: true,
    },
    tags: {
        type: [String],
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    payeeType: {
        type: String,
        enum: ['User', 'Organization'],
        required: true,
    },
    payeeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "payeeType",
    },
});

export const Income = mongoose.model<IIncome>("Income", incomeSchema);