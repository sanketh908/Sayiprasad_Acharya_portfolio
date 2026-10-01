import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Always open at the top. Without this a reload, or a link copied after using
// the nav (which used to leave #work in the address), lands mid-page.
history.scrollRestoration = 'manual'
if (location.hash) history.replaceState(null, '', location.pathname + location.search)
window.scrollTo(0, 0)

// In-page links scroll smoothly without writing a #hash into the address bar.
document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest?.('a[href^="#"]')
  if (!link) return
  const id = link.getAttribute('href')!.slice(1)
  const target = id === 'top' ? document.body : document.getElementById(id)
  if (!target) return
  event.preventDefault()
  if (id === 'top') window.scrollTo({ top: 0 })
  else target.scrollIntoView()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
