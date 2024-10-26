import { Landing } from '@/pages/Landing'
import Chat from '@/pages/Chat'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionPage } from '@/pages/TransactionPage'
import { Route, Routes } from 'react-router-dom'
import OrganizationManager from '@/pages/OrganizationManager'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      <Route path="/transaction" element={<TransactionPage />} />
      <Route path="/manager" element={<OrganizationManager />} />
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  )
}

export default AppRoutes
