import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Aurora from './pages/Aurora'
import Privacy from './pages/Privacy'
import Ugy1 from './pages/ugy1'
//import Ugy2 from './pages/ugy2'
//import Ugy3 from './pages/ugy3'
//import Ugy4 from './pages/ugy4'
//import Ugy5 from './pages/ugy5'
//import Ugy6 from './pages/ugy6'
//import Ugy7 from './pages/ugy7'
//import Ugy8 from './pages/ugy8'
//import Ugy9 from './pages/ugy9'
//import Ugy10 from './pages/ugy10'
//import Ugy11 from './pages/ugy11'
//import Ugy12 from './pages/ugy12'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="scanlines" aria-hidden="true"></div>
        <div className="grid-overlay" aria-hidden="true"></div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/aurora" element={<Aurora />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/ugy1" element={<Ugy1 />} />
          {/*<Route path="/ugy2" element={<Ugy2 />} />
          <Route path="/ugy3" element={<Ugy3 />} />
          <Route path="/ugy4" element={<Ugy4 />} />
          <Route path="/ugy5" element={<Ugy5 />} />
          <Route path="/ugy6" element={<Ugy6 />} />
          <Route path="/ugy7" element={<Ugy7 />} />
          <Route path="/ugy8" element={<Ugy8 />} />
          <Route path="/ugy9" element={<Ugy9 />} />
          <Route path="/ugy10" element={<Ugy10 />} />
          <Route path="/ugy11" element={<Ugy11 />} />
          <Route path="/ugy12" element={<Ugy12 />} />*/}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

