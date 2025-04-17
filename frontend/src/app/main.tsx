import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from "../pages/header.tsx"
import { Outlet } from "react-router"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Header></Header>
      <Outlet />
  </StrictMode>,
)
