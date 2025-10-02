// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from "react-simple-query";
const BASE_URL = "https://jsonplaceholder.typicode.com"

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryProvider config={{cash: true, baseUrl:BASE_URL, cashTimeout: 5000, requestTimeout: 6000}}>
       <App />
    </QueryProvider>
  // </StrictMode>,
)
