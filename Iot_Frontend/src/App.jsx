import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      {/* <div className='flex'> */}
        <Sidebar />

        <Navbar />

      {/* </div> */}

    </>
  )
}

export default App
