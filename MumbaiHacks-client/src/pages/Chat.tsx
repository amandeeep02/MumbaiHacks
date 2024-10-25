/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axiosInstance from '@/utility/axiosInterceptor'
import { postRequest } from '@/utility/generalServices'

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_GOOGLE_API_KEY}`)

  //write a tsx function to take date such as "24/10/2024" and convert to 2023-10-01T00:00:00.000Z
  const convertDate = (date: String) => {
    const dateArray = date.split('/')
    const year = dateArray[2]
    const month = dateArray[1]
    const day = dateArray[0]
    return `${year}-${month}-${day}T00:00:00.000Z`
  }

  const AddExpense = async (
    amount: number,
    description: String,
    date: String,
    paymentMethod: String,
    tags: any
  ) => {
    await postRequest('/expenses', {
      organizationId: '671bed7fe260c817b36fee43',
      amount: amount,
      description: description,
      date: convertDate(date),
      paymentMethod: 'Credit Card',
      tags: tags,
      createdBy: '671becaae260c817b36fee3c',
      payeeType: 'User',
      payeeId: '671bef001f29eb67a5432c9f',
    })

    console.log("Hello");
  }

  const getResponseForGivenPrompt = async () => {
    try {
      setLoading(true)
      if (inputValue === '') {
        setLoading(false)
        return
      }

      const appendChatHistory = [
        ...chatHistory,
        { userID: 'user', textContent: inputValue },
      ]

      setChatHistory(appendChatHistory)

      console.log('pressed')
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const toSend =
        'You are a finance helper, give in consistent format, recheck if you have followed all commands in this prompt, and give a valid json, also make sure its just plain text dont format it at all just send text purely information with no jargon only purely english characters and `.` and `,` obiviously no `*` and all, so there will be five fields, userID which will always be `chatBot`, and the other field is `textContent` which will be the response to the query like the actual answer to the query asked in which give some confirmation to what you have done and if you dont understand the user input, dont return any functions to perform and ask for clarification, `functionToBePeformed` for which here is the list -> {addData, fetchData, createReportAndEmailTo, createReport, deleteData, None}, and finally `tag`, multiple of which can be assigned and {Travel, Food, OfficeSupply, MarketingExpense, TechExpense, ResearchAndDevelopment, OfficeBills, Miscellaneous}, and finally `RelevantData`, which is a map of the following fields with relevant data attached, and for date, if nothing is mentioned make it `26/10/2024`, and the currency is by default rupees so if a number is randomly mentioned think of it as just money - {ExpenseOrProfit, Date, Amount, Description, PaymentMethod, PayeeID}, if functionToPerform is `createReportAndEmailTo` then make sure the user enters email too which is added in relevant information as `emailToSendTo` and take a `startDate` and `endDate` and if deleting, make sure the user provides the relevant information required to know what to delete as the field `informationToDelete` and if the relevant data is not something you can make out from the message, just add it as `none` but do not make up your own data for the fields, since this is being put into a real database of real expenses, but if Amount is not mentioned then it wont work. Please recheck make sure the response is correct format. The next sentence onwards it will be the user speaking-> ' +
        inputValue
      setInputValue('')
      console.log('toSend', toSend)
      const result = await model.generateContent(toSend)
      const response = result.response
      let text = await response.text()

      console.log('text', text)
      text = text.replace('```json\n', '')
      text = text.replace('\n```', '')
      console.log('text', text)
      const parsedResponse = JSON.parse(text)
      // if (parsedResponse.functionToBePeformed === 'addData') {
      AddExpense(
        parsedResponse.RelevantData.Amount,
        parsedResponse.RelevantData.Description,
        parsedResponse.RelevantData.Date,
        parsedResponse.RelevantData.PaymentMethod,
        parsedResponse.tag
      )
      // }

      const appendChatHistoryResponse = [
        ...appendChatHistory,
        {
          userID: parsedResponse.userID,
          textContent: parsedResponse.textContent,
        },
      ]

      setLoading(false)
      setChatHistory(appendChatHistoryResponse)

      // Log other fields for potential backend use
      console.log(
        'Function to be performed:',
        parsedResponse.functionToBePeformed
      )
      console.log('Tags:', parsedResponse.tag)
      console.log('Relevant Data:', parsedResponse.RelevantData)

      // Here you could add logic to send this data to your backend
      // For example:
      // await sendToBackend(parsedResponse);
    } catch (error) {
      console.log('Something went wrong', error)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <a href="/">
          <h2 className="text-xl font-bold">{`< Dashboard`}</h2>
        </a>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <span className="text-lg">Cash Kaki</span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`${chat.userID === 'chatBot' ? 'text-right' : 'text-left'
                } bg-muted/100 p-2 rounded font-semibold`}
            >
              <p className="text-lg">{chat.textContent}</p>
            </div>
          ))}
          {loading ? (
            <div className="text-right bg-muted/100 p-2 rounded">
              <p className="text-lg">Loading...</p>
            </div>
          ) : null}
        </div>
      </main>
      <div className="bg-background border-t border-border px-6 py-4 bot-0">
        <div className="relative">
          <Textarea
            className="w-full rounded-lg pr-16 resize-none"
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <Button
            type="submit"
            size="icon"
            onClick={getResponseForGivenPrompt}
            className="absolute w-14 h-14 top-3 right-3"
          >
            <SendIcon className="w-6 h-6" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <Button type="button" size="icon" className="mt-2 w-full">
          <MicIcon className="w-6 h-6 mr-2" />
          Voice Input
        </Button>
      </div>
    </div>
  )
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function MicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}
