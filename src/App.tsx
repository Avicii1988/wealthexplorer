import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { LanguageProvider } from './i18n'
import './index.css'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/wealthexplorer">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/celebrities/:id" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
