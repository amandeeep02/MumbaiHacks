// telegramBot.ts
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from "crypto";
import { UserManager } from "../models/telegram.user.model"; // Import UserManager

// Replace with your actual token
const token: string = "7962210133:AAHhzogAtjTC3X9mBMFSW0cl7TdU19XHhv4";
const bot = new TelegramBot(token, { polling: true });
const genAI = new GoogleGenerativeAI("AIzaSyDR2qWdRiKg92wPWeqHflabXuKbw-k6m0k");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Initialize UserManager
const userManager = new UserManager();

// Command handlers
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(
    chatId,
    "Welcome! Available commands:\n\n" +
      "Authentication:\n" +
      "/register <email> <password> - Register new account\n" +
      "/login <email> <password> - Login to existing account\n" +
      "/verify <code> - Verify your registration\n\n" +
      "Organization Management:\n" +
      "/create_org <name> - Create a new organization\n" +
      "/invite <org_name> <email> <role> - Invite member (role: admin/member)\n" +
      "/accept_invite <org_name> - Accept an organization invite\n" +
      "/my_orgs - List your organizations\n" +
      "/org_members <org_name> - List organization members"
  );
});

// Authentication commands
bot.onText(/\/register (.+) (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const email = match[1];
  const password = match[2];

  // Validate email and password
  if (!email || !password) {
    await bot.sendMessage(chatId, "Email and password cannot be empty.");
    return;
  }

  const response = await userManager.register(chatId, email, password);
  await bot.sendMessage(chatId, response);
});

bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const response = await userManager.login(chatId, match[1], match[2]);
  await bot.sendMessage(chatId, response);
});

bot.onText(/\/verify (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  const response = await userManager.verify(chatId, match[1]);
  await bot.sendMessage(chatId, response);
});

// Organization management commands
bot.onText(/\/create_org (.+)/, async (msg, match) => {
  if (!match) return;
  const chatId = msg.chat.id;
  // Here you'd need to connect to MongoDB for org management
  // Assuming similar methods and data structure as UserManager for organization data.
  const response =
    "Organization creation functionality to be implemented with MongoDB.";
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
  const isAuthorized = await userManager.isAuthorized(chatId);
  if (!isAuthorized) {
    await bot.sendMessage(
      chatId,
      "You need to register and verify your account first.\n" +
        "Use /start to see available commands."
    );
    return;
  }

  try {
    const result = await model.generateContent(
      "You are a finance helper, give in consistent format, recheck if you have followed all commands in this prompt, and give a valid json, also make sure its just plain text dont format it at all just send text purely information with no jargon only purely english characters and `.` and `,` obiviously no `*` and all, so there will be five fields, userID which will always be `chatBot`, and the other field is `textContent` which will be the response to the query like the actual answer to the query asked in which give some confirmation to what you have done and if you dont understand the user input, dont return any functions to perform and ask for clarification, `functionToBePeformed` for which here is the list -> {addData, fetchData, emailTo, createReport, deleteData, None}, and finally `tag`, multiple of which can be assigned and {Travel, Food, OfficeSupply, MarketingExpense, TechExpense, ResearchAndDevelopment, OfficeBills, Miscellaneous}, and finally `RelevantData`, which is a map of the following fields with relevant data attached, and for date, if nothing is mentioned make it `26/10/2024`, and the currency is by default rupees so if a number is randomly mentioned think of it as just money - {ExpenseOrProfit, Date, Amount, Description, PaymentMethod, PayeeID}, and if the relevant data is not something you can make out from the message, just add `none` in front of it. Please recheck make sure the response is correct format. The next sentence onwards it will be the user speaking-> " +
        inputValue
    );

    const responseText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const jsonResponse = JSON.parse(responseText);
    console.log(jsonResponse);

    const textContent = jsonResponse.textContent;
    jsonResponse.userID = chatId;
    console.log(chatId);

    await bot.sendMessage(chatId, textContent);
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    await bot.sendMessage(
      chatId,
      "Sorry, I couldn't process your request at this time."
    );
  }
});
