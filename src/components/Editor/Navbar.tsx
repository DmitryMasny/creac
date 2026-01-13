import { useState } from 'react';
import { Link } from 'react-router-dom'; // или другой роутер

import ExportButton from './ExportButton';

import { siteConfig } from '@/config/site';

//EDITOR NAVBAR
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 px-4">
      {/* Левый сектор - лого и навигация */}
      <div className="navbar-start">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2 text-xl font-bold" to="/">
            <img src="nc.png" alt="Noc" srcSet="nc.png 512w" width={32} />

            <span>node→code</span>
          </Link>
        </div>
      </div>

      {/* Правый сектор - действия */}
      <div className="navbar-end gap-2">
        <ExportButton />
      </div>

      {/* Мобильное меню */}
      <div className="dropdown dropdown-end sm:hidden">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </button>

        {isMenuOpen && (
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {/* Навигация */}
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Link
                  className={index === 2 ? 'text-primary' : ''}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <div className="divider my-1" />

            {/* Действия */}
            <li>
              <Link target="_blank" to={siteConfig.links.github}>
                GitHub
              </Link>
            </li>
            <li>{/* <ThemeSwitch /> */}</li>
          </ul>
        )}
      </div>
    </div>
  );
};
