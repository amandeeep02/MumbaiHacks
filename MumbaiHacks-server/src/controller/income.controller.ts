import { Request, Response, NextFunction } from "express";
import { IncomeModel } from "../models/income.model";
import UserModel from "../models/user.model";
import { catchAsync } from "../utils/utils";
import AppError from "../utils/appError";
import mongoose from "mongoose";

// Get all incomes
export const getAllIncomes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const incomes = await IncomeModel.find();
    res.status(200).json({
        status: "success",
        results: incomes.length,
        data: incomes,
    });
});

export const getAllIncomesByOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { userId, organizationId } = req.body;
    
        if (!userId || !organizationId) {
            return next(new AppError("userId and organizationId are required", 400));
        }
    
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("No user found with that ID", 404));
        }
    
        // Check if user is part of the organization
        if (!user.organizationIds.includes(organizationId)) {
            return next(new AppError("User is not part of the organization", 403));
        }
    
        const incomes = await IncomeModel.find({ organizationId });
        res.status(200).json({
            status: "success",
            results: incomes.length,
            data: incomes,
        });
    });

    export const getAllIncomesByOrganizationBetweenDates = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { userId, organizationId, startDate, endDate } = req.body;
    
        if (!userId || !organizationId || !startDate || !endDate) {
            return next(new AppError("userId, organizationId, startDate, and endDate are required", 400));
        }
    
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("No user found with that ID", 404));
        }
    
        // Check if user is part of the organization
        if (!user.organizationIds.includes(organizationId)) {
            return next(new AppError("User is not part of the organization", 403));
        }
    
        const incomes = await IncomeModel.find({
            organizationId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
    
        res.status(200).json({
            status: "success",
            results: incomes.length,
            data: incomes,
        });
    });

    export const getIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { incomeId, organizationId, userId } = req.body;
    
        // Check if income exists
        const income = await IncomeModel.findById(incomeId);
        if (!income) {
            return next(new AppError("No income found with that ID", 404));
        }
    
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("No user found with that ID", 404));
        }
    
        // Check if user is part of the organization
        if (!user.organizationIds.includes(organizationId)) {
            return next(new AppError("User is not part of the organization", 403));
        }
    
        // Check if income belongs to the organization
        if (!income.organizationId.toString() === organizationId.toString()) {
            return next(new AppError("Income does not belong to the organization", 404));
        }
    
        res.status(200).json({
            status: "success",
            data: income,
        });
    });

    export const createIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { organizationId, amount, tags, payeeType, payeeName, description, createdBy, paymentMethod } = req.body;
        const date = new Date();
    
        // Check if user exists 
        const userObjectId = new mongoose.Types.ObjectId(createdBy);
    
        const user = await UserModel.findById(userObjectId);
        if (!user) {
            return next(new AppError("No user found with that ID", 404));
        }
    
        // Check if user is part of the organization
        if (!user.organizationIds.includes(organizationId)) {
            return next(new AppError("User is not part of the organization", 403));
        }
    
        let payeeId;
        if (payeeType === "Organization") {
            const organization = await UserModel.findOne({ name: payeeName });
            if (!organization) {
                return next(new AppError("No organization found with that name", 404));
            }
            payeeId = organization._id;
        } else {
            const payee = await UserModel.findOne({ name: payeeName });
            if (!payee) {
                return next(new AppError("No user found with that name", 404));
            }
            payeeId = payee._id;
        }
    
        const newIncome = await IncomeModel.create({
            organizationId,
            description,
            amount,
            tags,
            date,
            payeeType,
            payeeId,
            createdBy: userObjectId,
            paymentMethod: paymentMethod
        });
    
        res.status(201).json({
            status: "success",
            data: newIncome,
        });
    });

    export const updateIncome = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id, organizationId, userId } = req.body;
    
        // Check if income exists
        const income = await IncomeModel.findById(id);
        if (!income) {
            return next(new AppError("No income found with that ID", 404));
        }
    
        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new AppError("No user found with that ID", 404));
        }
    
        // Check if user is part of the organization
        if (!user.organizationIds.includes(organizationId)) {
            return next(new AppError("User is not part of the organization", 403));
        }
    
        // Check if income belongs to the organization
        if (!income.organizationId.toString() === organizationId.toString()) {
            return next(new AppError("Income does not belong to the organization", 404));
        }
    
        const updatedIncome = await IncomeModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
    
        res.status(200).json({
            status: "success",
            data: updatedIncome,
        });
    });