import TelegramBot from "node-telegram-bot-api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

// Replace with your actual token
const token: string = "7962210133:AAHhzogAtjTC3X9mBMFSW0cl7TdU19XHhv4";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(
  "AIzaSyDR2qWdRiKg92wPWeqHflabXuKbw - k6m0k"
);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Listen for any kind of message
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const inputValue = msg.text || "";

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
