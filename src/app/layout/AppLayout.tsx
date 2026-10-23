import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import doctorIllustration from '../../shared/assets/doctor-illustration.svg'

import styles from './AppLayout.module.css'

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <>
      <header
        className={`${styles.header} ${isMenuOpen ? styles.headerOpen : ''}`}
      >
        <div className={styles.mobileBar}>
          <span className={styles.brand}>
            <img className={styles.brandIcon} src={doctorIllustration} alt="" />
            HiDoc
          </span>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((previous) => !previous)}
          >
            <span aria-hidden="true">{isMenuOpen ? 'x' : '☰'}</span>
          </button>
        </div>

        <nav
          id="main-navigation"
          className={`${styles.navigation} ${
            isMenuOpen ? styles.navigationOpen : ''
          }`}
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsMenuOpen(false)
              document
                .querySelector<HTMLButtonElement>(
                  '[aria-controls="main-navigation"]',
                )
                ?.focus()
            }
          }}
        >
          <span className={`${styles.brand} ${styles.desktopBrand}`}>
            <img className={styles.brandIcon} src={doctorIllustration} alt="" />
            HiDoc
          </span>

          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ''}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Doctors
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ''}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            My appointments
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ''}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.activeLink : ''}`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </NavLink>
        </nav>
      </header>

      <div className={styles.content}>
        <Outlet />
      </div>
    </>
  )
}
