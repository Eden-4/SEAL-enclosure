import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Diagnostics from './components/Diagnostics'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
        </Routes>
      </main>
    </>
  )
}

export default App
