import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initPhotoStore } from './data/photoStore'
import { fetchCelebrities } from './hooks/useCelebrityData'

// Pre-fetch all data before first render:
// - photo caches (~542 KB) so avatars/assets are available immediately
// - celebrities JSON so the hook returns data synchronously on first render
Promise.all([
  initPhotoStore(),
  fetchCelebrities(),
]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
