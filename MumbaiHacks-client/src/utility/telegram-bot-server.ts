import express from 'express'
import type { Request, Response } from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import { GoogleGenerativeAI } from '@google/generative-ai'

const app = express()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY ?? '')

app.use(bodyParser.json())

interface TelegramMessage {
  message_id: number
  from: {
    id: number
    is_bot: boolean
    first_name: string
    username?: string
    language_code?: string
  }
  chat: {
    id: number
    first_name: string
    username?: string
    type: string
  }
  date: number
  text: string
}

interface TelegramUpdate {
  update_id: number
  message: TelegramMessage
}

app.post(
  '/webhook',
  async (req: Request<{}, {}, TelegramUpdate>, res: Response) => {
    const { message } = req.body
    if (message && message.text) {
      const chatId = message.chat.id
      const userMessage = message.text

      try {
        const geminiResponse = await getGeminiResponse(userMessage)
        const parsedResponse = JSON.parse(geminiResponse)

        // Send the textContent to the Telegram chat
        await sendTelegramMessage(chatId, parsedResponse.textContent)

        // Here you would handle the other fields like functionToBePerformed, tag, and RelevantData
        // For example, you might want to store this data or perform actions based on it
        console.log(
          'Function to be performed:',
          parsedResponse.functionToBePeformed
        )
        console.log('Tags:', parsedResponse.tag)
        console.log('Relevant Data:', parsedResponse.RelevantData)
      } catch (error) {
        console.error('Error processing message:', error)
        await sendTelegramMessage(
          chatId,
          'Sorry, there was an error processing your message.'
        )
      }
    }
    res.sendStatus(200)
  }
)

async function getGeminiResponse(userMessage: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  const prompt =
    'You are a finance helper, give in consistent format, recheck if you have followed all commands in this prompt, and give a valid json, also make sure its just plain text dont format it at all just send text purely information with no jargon only purely english characters and `.` and `,` obiviously no `*` and all, so there will be five fields, userID which will always be `chatBot`, and the other field is `textContent` which will be the response to the query like the actual answer to the query asked in which give some confirmation to what you have done and if you dont understand the user input, dont return any functions to perform and ask for clarification, `functionToBePeformed` for which here is the list -> {addData, fetchData, emailTo, createReport, deleteData, None}, and finally `tag`, multiple of which can be assigned and {Travel, Food, OfficeSupply, MarketingExpense, TechExpense, ResearchAndDevelopment, OfficeBills, Miscellaneous}, and finally `RelevantData`, which is a map of the following fields with relevant data attached, and for date, if nothing is mentioned make it `26/10/2024`, and the currency is by default rupees so if a number is randomly mentioned think of it as just money - {ExpenseOrProfit, Date, Amount, Description, PaymentMethod, PayeeID}, and if the relevant data is not something you can make out from the message, just add `none` in front of it. Please recheck make sure the response is correct format. The next sentence onwards it will be the user speaking-> ' +
    userMessage

  const result = await model.generateContent(prompt)
  const response = result.response
  let text = await response.text()

  // Remove any JSON formatting if present
  text = text.replace(/```json\n?|\n?```/g, '')

  return text
}

async function sendTelegramMessage(
  chatId: number,
  text: string
): Promise<void> {
  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: text,
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
