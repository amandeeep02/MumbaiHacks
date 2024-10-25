import { IOrganization } from "../Interfaces/organization.interface";
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema<IOrganization>({
        name: { type: String, required: true },
        description: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
        businessType: { type: String, required: true },
        employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    });
    
    export const OrganizationModel = mongoose.model<IOrganization>('Organization', organizationSchema);