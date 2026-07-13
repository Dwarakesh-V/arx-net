import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Generation from './pages/Generation'
import Interactions from './pages/Interactions'
import Algorithms from './pages/Algorithms'
import PythonIntegration from './pages/PythonIntegration'

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generation" element={<Generation />} />
          <Route path="/interactions" element={<Interactions />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/python-integration" element={<PythonIntegration />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
