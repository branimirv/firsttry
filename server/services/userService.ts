import mongoose from "mongoose";
import User, { type IUser } from "../models/User.js";
import { NotFoundError } from "../utils/error.js";

/**
 * Data required to create a new user
 */
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

/**
 * Helper function to convert ObjectId types
 */
const toObjectId = (
  id: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId
): mongoose.Types.ObjectId => {
  if (id instanceof mongoose.Types.ObjectId) {
    return id;
  }
  return new mongoose.Types.ObjectId(id.toString());
};

/**
 * Find user by email (without password)
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

/**
 * Find user by email with password (for login/authentication)
 */
export const findUserByEmailWithPassword = async (
  email: string
): Promise<IUser | null> => {
  return await User.findOne({ email }).select("+password");
};

/**
 * Find user by ID
 * Accepts both mongoose.Types.ObjectId and mongoose.Schema.Types.ObjectId
 */
export const findUserById = async (
  userId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId
): Promise<IUser | null> => {
  const objectId = toObjectId(userId);
  return await User.findById(objectId);
};

/**
 * Create a new user
 */
export const createUser = async (userData: CreateUserData): Promise<IUser> => {
  return await User.create(userData);
};

/**
 * Update user password
 * Accepts both mongoose.Types.ObjectId and mongoose.Schema.Types.ObjectId
 */
export const updateUserPassword = async (
  userId: mongoose.Types.ObjectId | mongoose.Schema.Types.ObjectId,
  hashedPassword: string
): Promise<IUser> => {
  const objectId = toObjectId(userId);
  const user = await User.findById(objectId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.password = hashedPassword;
  await user.save();
  return user;
};

/**
 * Check if user exists by email
 */
export const userExists = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return !!user;
};
