import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initPhotoStore } from './data/photoStore'

// Fetch photo caches (~542 KB) before first render so avatars/assets
// are available immediately without a flash of placeholder images.
initPhotoStore().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
