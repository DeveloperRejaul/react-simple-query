// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from "react-simple-query";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryProvider config={{cash: true}}>
       <App />
    </QueryProvider>
  // </StrictMode>,
)
