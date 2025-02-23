import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Dialog>
      <DialogTrigger className="px-4 py-2 bg-blue-600 text-white rounded-lg">Otevřít modal</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Potvrzení akce</DialogTitle>
        </DialogHeader>
        <p>Opravdu chceš smazat tým?</p>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default App
