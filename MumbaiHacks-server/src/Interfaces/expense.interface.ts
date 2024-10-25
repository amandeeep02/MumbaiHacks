import { ObjectId } from "mongoose";
import { Document } from "mongoose";

export interface IExpense extends Document {
        organizationId: ObjectId;
        amount: number;
        description?: string;
        date: Date;
        paymentMethod: 'Cash' | 'Credit Card' | 'Bank Transfer';
        tags?: string[];
        createdBy: ObjectId;
        payeeType: 'User'|'Organization';
        payeeId: ObjectId;
    }