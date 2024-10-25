import { Landing } from '@/pages/Landing'
import Chat from '@/pages/Chat'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default AppRoutes
