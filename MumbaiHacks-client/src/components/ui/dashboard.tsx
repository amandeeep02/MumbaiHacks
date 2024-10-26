import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ArrowDownIcon, ArrowUpIcon, DollarSign, LineChart, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/Sidebar"
import { postRequest } from "@/utility/generalServices"


const recentTransactions = [
  { id: 1, description: "Office Supplies", amount: -250.00, date: "2024-10-23" },
  { id: 2, description: "Client Payment", amount: 1500.00, date: "2024-10-22" },
  { id: 3, description: "Software Subscription", amount: -89.99, date: "2024-10-21" },
  { id: 4, description: "Utility Bill", amount: -120.50, date: "2024-10-20" },
]

const expenseData = [
  { name: "Jan", amount: 4000 },
  { name: "Feb", amount: 3000 },
  { name: "Mar", amount: 2000 },
  { name: "Apr", amount: 2780 },
  { name: "May", amount: 1890 },
  { name: "Jun", amount: 2390 },
]




export default function Dashboard() {
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseDescription, setNewExpenseDescription] = useState("")
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const response = await postRequest('/api/expenses/organization', {});
      setResponseData(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  fetchExpenses();
}, []);


  const handleAddExpense = () => {
    // Here you would typically add the new expense to your state or send it to an API
    console.log("Adding expense:", { amount: newExpenseAmount, description: newExpenseDescription })
    setNewExpenseAmount("")
    setNewExpenseDescription("")
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <h2 className="text-lg font-semibold">Business Expense Tracker</h2>
              <Button className="ml-auto" size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹12,345</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹45,678</div>
                  <p className="text-xs text-muted-foreground">+18.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹33,333</div>
                  <p className="text-xs text-muted-foreground">+8.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Expense Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={expenseData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `₹${value}`} />
                      <Bar dataKey="amount" fill="#404040" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>You made 4 transactions this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${transaction.amount > 0 ? "bg-green-500" : "bg-red-500"}`}>
                          {transaction.amount > 0 ? (
                            <ArrowUpIcon className="h-4 w-4 text-white" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-white" />
                          )}  
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <div className={`ml-auto font-medium ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                          {transaction.amount > 0 ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Enter the details of your new expense.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="amount">Amount</label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      type="number"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description">Description</label>
                    <Input
                      id="description"
                      placeholder="Enter description"
                      value={newExpenseDescription}
                      onChange={(e) => setNewExpenseDescription(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}