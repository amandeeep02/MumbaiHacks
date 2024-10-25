import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import * as fs from "fs";
import * as crypto from "crypto";

// Replace with your actual token
const token: string = "7962210133:AAHhzogAtjTC3X9mBMFSW0cl7TdU19XHhv4";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyDR2qWdRiKg92wPWeqHflabXuKbw-k6m0k");

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// User management
interface User {
  chatId: number;
  email: string;
  passwordHash: string;
  isVerified: boolean;
}

class UserManager {
  private users: User[] = [];
  private pendingVerifications: Map<number, string> = new Map();
  private readonly usersFile = "users.json";

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      if (fs.existsSync(this.usersFile)) {
        const data = fs.readFileSync(this.usersFile, "utf8");
        this.users = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  private saveUsers() {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  }

  isAuthorized(chatId: number): boolean {
    return this.users.some((user) => user.chatId === chatId && user.isVerified);
  }

  async register(
    chatId: number,
    email: string,
    password: string
  ): Promise<string> {
    if (this.users.some((user) => user.email === email)) {
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

    const newUser: User = {
      chatId,
      email,
      passwordHash,
      isVerified: false,
    };

    this.users.push(newUser);
    this.pendingVerifications.set(chatId, verificationCode);
    this.saveUsers();

    return `Registration successful! Your verification code is: ${verificationCode}\nUse /verify <code> to complete registration.`;
  }

  async verify(chatId: number, code: string): Promise<string> {
    const storedCode = this.pendingVerifications.get(chatId);
    if (!storedCode || storedCode !== code) {
      return "Invalid verification code. Please try again.";
    }

    const user = this.users.find((u) => u.chatId === chatId);
    if (user) {
      user.isVerified = true;
      this.saveUsers();
      this.pendingVerifications.delete(chatId);
      return "Verification successful! You can now use the bot.";
    }

    return "User not found. Please register first using /register.";
  }

  async login(
    chatId: number,
    email: string,
    password: string
  ): Promise<string> {
    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const user = this.users.find(
      (u) => u.email === email && u.passwordHash === passwordHash
    );

    if (!user) {
      return "Invalid email or password.";
    }

    user.chatId = chatId; // Update chat ID in case it changed
    user.isVerified = true;
    this.saveUsers();
    return "Login successful!";
  }
}

const userManager = new UserManager();

// Command handlers
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    "Welcome! Please use one of the following commands:\n" +
      "/register <email> <password> - Register new account\n" +
      "/login <email> <password> - Login to existing account\n" +
      "/verify <code> - Verify your registration"
  );
});

bot.onText(/\/register (.+) (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const email = match[1];
  const password = match[2];
  const response = await userManager.register(chatId, email, password);
  await bot.sendMessage(chatId, response);
});

bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const email = match[1];
  const password = match[2];
  const response = await userManager.login(chatId, email, password);
  await bot.sendMessage(chatId, response);
});

bot.onText(/\/verify (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const code = match[1];
  const response = await userManager.verify(chatId, code);
  await bot.sendMessage(chatId, response);
});

// Main message handler
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const inputValue = msg.text || "";

  // Skip authentication check for commands
  if (inputValue.startsWith("/")) {
    return;
  }

  // Check if user is authorized
  if (!userManager.isAuthorized(chatId)) {
    await bot.sendMessage(
      chatId,
      "You need to register and verify your account first.\n" +
        "Use /start to see available commands."
    );
    return;
  }

  try {
    // Generate content using the correct method
    const result = await model.generateContent(
      "You are a finance helper, give in consistent format, recheck if you have followed all commands in this prompt, and give a valid json, also make sure its just plain text dont format it at all just send text purely information with no jargon only purely english characters and `.` and `,` obiviously no `*` and all, so there will be five fields, userID which will always be `chatBot`, and the other field is `textContent` which will be the response to the query like the actual answer to the query asked in which give some confirmation to what you have done and if you dont understand the user input, dont return any functions to perform and ask for clarification, `functionToBePeformed` for which here is the list -> {addData, fetchData, emailTo, createReport, deleteData, None}, and finally `tag`, multiple of which can be assigned and {Travel, Food, OfficeSupply, MarketingExpense, TechExpense, ResearchAndDevelopment, OfficeBills, Miscellaneous}, and finally `RelevantData`, which is a map of the following fields with relevant data attached, and for date, if nothing is mentioned make it `26/10/2024`, and the currency is by default rupees so if a number is randomly mentioned think of it as just money - {ExpenseOrProfit, Date, Amount, Description, PaymentMethod, PayeeID}, and if the relevant data is not something you can make out from the message, just add `none` in front of it. Please recheck make sure the response is correct format. The next sentence onwards it will be the user speaking-> " +
        inputValue
    );

    // Clean up response text by removing any unwanted characters
    const responseText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const jsonResponse = JSON.parse(responseText);
    console.log(jsonResponse);

    // Extract only textContent for Telegram response
    const textContent = jsonResponse.textContent;
    jsonResponse.userID = chatId;
    console.log(chatId);

    // Send only textContent to the user on Telegram
    await bot.sendMessage(chatId, textContent);

    // Full JSON response for backend processing
    const { userID, functionToBePeformed, tag, RelevantData } = jsonResponse;
    // Handle backend logic with the JSON structure here as needed
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    await bot.sendMessage(
      chatId,
      "Sorry, I couldn't process your request at this time."
    );
  }
});
