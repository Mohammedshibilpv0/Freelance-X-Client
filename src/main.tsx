
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { GoogleOAuthProvider } from "@react-oauth/google"
import React from 'react'
import { GOOGLECLIENTID } from './utility/env.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <React.StrictMode>
  <GoogleOAuthProvider clientId={GOOGLECLIENTID}>
  <ChakraProvider>
    <App />
  </ChakraProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>
  </BrowserRouter>
)
