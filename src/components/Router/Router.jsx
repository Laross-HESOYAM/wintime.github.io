import React, { useEffect, useState } from 'react'
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from '../Web/Main'
import Login_Page from '../Web/Login_Page/Login_Page'
import { AuthProvider } from '../../context/AuthProvider'
const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login_Page />}></Route>
          <Route path="main" element={<Main />}></Route>
          {/* <Route path="main/stanok" element={<Stanok />}></Route> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default Router
