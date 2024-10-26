import { Request, Response, NextFunction } from "express";
import { OrganizationModel } from "../models/organization.model";
import UserModel from "../models/user.model";
import AppError from "../utils/appError";
import { catchAsync } from "../utils/utils";
import mongoose from "mongoose";

// Add a new organization
export const addOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, owner, businessType } = req.body;

    // Check if owner exists
    const ownerExists = await UserModel.findById(owner);
    if (!ownerExists) {
      return next(new AppError("Owner not found", 404));
    }

    // Check if organization already exists
    const orgExists = await OrganizationModel.findOne({ name });
    if (orgExists) {
      return next(new AppError("Organization already exists", 400));
    }

    // Create new organization
    const newOrganization = await OrganizationModel.create({
      name,
      description,
      owner,
      businessType,
      employees: [],
    });

    // Add organization to owner's organizations
    ownerExists.organizationIds.push(newOrganization._id);

    await ownerExists.save();

    res.status(201).json({
      status: "success",
      data: newOrganization,
    });
  }
);

// Add an employee to an organization
export const addEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { organizationId, employeeId, userId } = req.body;

    //check if user is the owner of the organization
    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(objectId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if organization exists
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) {
      return next(new AppError("Organization not found", 404));
    }

    // Check if user is the owner of the organization
    if (organization.owner.toString() != userId.toString()) {
      return next(
        new AppError("User is not the owner of the organization", 403)
      );
    }

    // Check if employee exists
    const employee = await UserModel.findById(employeeId);
    if (!employee) {
      return next(new AppError("Employee not found", 404));
    }

    if (organization.owner.toString() == employeeId.toString()) {
      return next(new AppError("Owner cannot be added as an employee", 400));
    }

    // Add employee to organization
    organization.employees.push(employeeId);
    await organization.save();

    // Add organization to employee's organizations
    employee.organizationIds.push(organizationId);
    await employee.save();

    res.status(200).json({
      status: "success",
      data: organization,
    });
  }
);

// Get all organizations of a user
export const getUserOrganizations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("holaaaa");

    const { userId } = req.body;

    // Check if user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Get organizations of the user
    const organizations = await OrganizationModel.find({
      //ehre owner is the user
      owner: userId,
    }).populate("employees");

    res.status(200).json({
      status: "success",
      data: organizations,
    });
  }
);
