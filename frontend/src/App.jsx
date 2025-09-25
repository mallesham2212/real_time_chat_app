import React from 'react'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes   >
        <Route path='/'  element = {<Signup/>} />
        <Route path="/api/auth/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App