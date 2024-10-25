import { Landing } from '@/pages/Landing'
import Chat from '@/pages/Chat'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionPage } from '@/pages/TransactionPage'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<DashboardPage />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      <Route path="/transaction" element={<TransactionPage />} />
    </Routes>
  )
}

export default AppRoutes
