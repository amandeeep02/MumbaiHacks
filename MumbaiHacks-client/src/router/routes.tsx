import { Landing } from '@/pages/Landing'
import Chat from '@/pages/Chat'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionPage } from '@/pages/transactionPage'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transaction" element={<TransactionPage />} />
    </Routes>
  )
}

export default AppRoutes
