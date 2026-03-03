import { useState } from 'react'
import './App.css'

// Importar componentes
import Sidebar from './components/Sidebar'
import ViewNews from './components/ViewNews'
import CreateNews from './components/CreateNews'
import DeleteNews from './components/DeleteNews'

function App() {
  const [activeSection, setActiveSection] = useState('news')
  const [refreshNews, setRefreshNews] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNewsCreated = () => {
    setRefreshNews(refreshNews + 1)
    setActiveSection('news')
  }

  const handleNewsDeleted = () => {
    setRefreshNews(refreshNews + 1)
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`main-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="app-header">
          <button 
            className="menu-toggle"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div className="header-content">
            <h1>Gestor de Noticias</h1>
            <p>CMS Profesional</p>
          </div>
        </header>

        <main className="main-content">
          {activeSection === 'news' && <ViewNews refreshTrigger={refreshNews} />}
          {activeSection === 'create' && <CreateNews onNewsCreated={handleNewsCreated} />}
          {activeSection === 'delete' && <DeleteNews refreshTrigger={refreshNews} onNewsDeleted={handleNewsDeleted} />}
        </main>
      </div>
    </div>
  )
}

export default App
