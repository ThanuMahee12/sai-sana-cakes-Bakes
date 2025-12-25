import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div className="layout">
      <header className="header">
        <nav>
          <h1>React Starter</h1>
          {/* Add navigation here */}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2025 Your Project. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default MainLayout
