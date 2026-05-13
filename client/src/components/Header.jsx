import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="hero">
      <h1>SEAL Enclosure</h1>
      <p>Express + React baseline demo.</p>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/diagnostics">Diagnostics</NavLink>
      </nav>
    </header>
  )
}

export default Header
