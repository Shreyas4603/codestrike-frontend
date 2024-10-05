import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { ModeToggle } from './components/mode-toggle';

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(prevCount => prevCount + 1)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Button Test</h1>
      <div className="flex items-center space-x-4 mb-4">
        <ModeToggle />
        <Button onClick={handleClick}>
          Click me: {count}
        </Button>
      </div>
      <p>You've clicked the button {count} times.</p>
    </div>
  )
}

export default App
