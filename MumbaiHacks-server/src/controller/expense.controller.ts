import { Request, Response, NextFunction } from "express";
import { ExpenseModel } from "../models/expense.model";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/utils";
import UserModel from "../models/user.model";
import mongoose from "mongoose";

// Get all expenses
export const getAllExpenses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expenses = await ExpenseModel.find();
  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

export const getAllExpensesByOrganization = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

  const expenses = await ExpenseModel.find({ organizationId });
  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

export const getAllExpensesByOrganizationBetweenDates = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

  const expenses = await ExpenseModel.find({
    organizationId,
    date: { $gte: startDate, $lte: endDate }
  });

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: expenses,
  });
});

export const getExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { expenseId, organizationId, userId } = req.body;

  // Check if expense exists
  const expense = await ExpenseModel.findById(expenseId);
  if (!expense) {
    return next(new AppError("No expense found with that ID", 404));
  }

  // Check if user exists
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

//   // Check if user is part of the organization
  if (!user.organizationIds.includes(organizationId)) {
    return next(new AppError("User is not part of the organization", 403));
  }

  // Check if expense belongs to the organization

  res.status(200).json({
    status: "success",
    data: expense,
  });
});

// Create a new expense
export const createExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { organizationId, amount, tags, payeeType, payeeName, description, createdBy,paymentMethod } = req.body;
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

  const newExpense = await ExpenseModel.create({
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
    data: newExpense,
  });
});

// Update an existing expense by ID
export const updateExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, organizationId, userId } = req.body;

  // Check if expense exists
  const expense = await ExpenseModel.findById(id);
  if (!expense) {
    return next(new AppError("No expense found with that ID", 404));
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

  // Check if expense belongs to the organization
  if (!expense.organizationId.toString() === organizationId.toString()) {
    return next(new AppError("Expense does not belong to the organization", 404));
  }

  const updatedExpense = await ExpenseModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedExpense,
  });
});
