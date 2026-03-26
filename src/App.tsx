import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import { LanguageProvider } from './i18n'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

function App() {
  return (
    <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter basename="/wealthexplorer">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/celebrities/:id" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
