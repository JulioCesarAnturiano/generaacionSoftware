import './Sidebar.css'

const Sidebar = ({ activeSection, setActiveSection, isOpen, toggleSidebar }) => {
  const sections = [
    { id: 'news', label: 'Ver Noticias' },
    { id: 'create', label: 'Crear Noticia' },
    { id: 'delete', label: 'Eliminar Noticia' },
  ]

  const handleClick = (id) => {
    setActiveSection(id)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar()
    }
  }

  return (
    <>
      {isOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Menú</h2>
          <button className="close-btn" onClick={toggleSidebar}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => handleClick(section.id)}
            >
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="app-version">CMS v1.0</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
