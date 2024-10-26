// userModel.ts
import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";
interface IUser extends Document {
  chatId: number;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema = new Schema({
  chatId: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>("User", UserSchema);

// Updated UserManager class
class UserManager {
  private pendingVerifications: Map<number, string> = new Map();

  constructor() {
    this.connectToMongoDB();
  }

  private async connectToMongoDB() {
    try {
      await mongoose.connect(
        "mongodb+srv://amandeepsr02:ByROBqQyQp976h8f@dhanrashi.hydgt.mongodb.net/TeamWhyNot"
      );
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }

  async isAuthorized(chatId: number): Promise<boolean> {
    try {
      const user = await User.findOne({ chatId, isVerified: true });
      return !!user;
    } catch (error) {
      console.error("Error checking authorization:", error);
      return false;
    }
  }

  async register(
    chatId: number,
    email: string,
    password: string
  ): Promise<string> {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return "Email already registered. Please use /login instead.";
      }

      const verificationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const newUser = new User({
        chatId,
        email,
        passwordHash,
        isVerified: false,
      });

      await newUser.save();
      this.pendingVerifications.set(chatId, verificationCode);

      return "Registration successful! Your verification code is: ${verificationCode}\nUse /verify <code> to complete registration.";
    } catch (error) {
      console.error("Error during registration:", error);
      return "An error occurred during registration. Please try again later.";
    }
  }

  async verify(chatId: number, code: string): Promise<string> {
    try {
      const storedCode = this.pendingVerifications.get(chatId);
      if (!storedCode || storedCode !== code) {
        return "Invalid verification code. Please try again.";
      }

      const user = await User.findOne({ chatId });
      if (!user) {
        return "User not found. Please register first using /register.";
      }

      user.isVerified = true;
      await user.save();
      this.pendingVerifications.delete(chatId);

      return "Verification successful! You can now use the bot.";
    } catch (error) {
      console.error("Error during verification:", error);
      return "An error occurred during verification. Please try again later.";
    }
  }

  async login(
    chatId: number,
    email: string,
    password: string
  ): Promise<string> {
    try {
      const passwordHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      const user = await User.findOne({ email, passwordHash });
      if (!user) {
        return "Invalid email or password.";
      }

      user.chatId = chatId;
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();

      return "Login successful!";
    } catch (error) {
      console.error("Error during login:", error);
      return "An error occurred during login. Please try again later.";
    }
  }
}

export { UserManager, User };
