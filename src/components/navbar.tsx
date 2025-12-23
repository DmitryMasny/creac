import { useState } from 'react';
import { Link } from 'react-router-dom'; // или другой роутер

import { siteConfig } from '@/config/site';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const searchInput = (
    <label className="input input-bordered bg-base-200 flex items-center gap-2">
      <svg
        className="h-4 w-4 opacity-70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
      <input className="grow" placeholder="Search..." type="text" />
      <kbd className="kbd kbd-sm hidden lg:inline-flex">K</kbd>
    </label>
  );

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 mx-auto max-w-7xl px-4">
      {/* Левый сектор - лого и навигация */}
      <div className="navbar-start">
        <div className="flex items-center gap-4">
          {/* Бренд */}
          <Link className="flex items-center gap-2 text-xl font-bold" to="/">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              {/* Замени на свой логотип */}
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span>ACME</span>
          </Link>

          {/* Десктопная навигация */}
          <div className="ml-4 hidden lg:flex">
            <ul className="menu menu-horizontal gap-2 px-1">
              {siteConfig.navItems.map(item => (
                <li key={item.href}>
                  <Link
                    className="hover:text-primary font-medium transition-colors"
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Центральный сектор (пустой или для поиска) */}
      <div className="navbar-center">
        {/* Можно разместить searchInput здесь если нужно по центру */}
      </div>

      {/* Правый сектор - действия */}
      <div className="navbar-end gap-2">
        {/* Поиск на десктопе */}
        <div className="mr-4 hidden lg:flex">{searchInput}</div>

        <div className="hidden items-center gap-2 sm:flex">
          {/* GitHub ссылка */}
          <Link
            className="btn btn-ghost btn-circle"
            target="_blank"
            to={siteConfig.links.github}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>

          {/* <ThemeSwitch /> */}

          {/* <ExportButton /> */}
        </div>

        {/* Мобильное меню */}
        <div className="dropdown dropdown-end sm:hidden">
          <span
            className="btn btn-ghost btn-circle"
            tabIndex={0}
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
          </span>

          {isMenuOpen && (
            <ul
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              tabIndex={0}
            >
              {/* Поиск в мобильном меню */}
              <li className="p-2">{searchInput}</li>

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
    </div>
  );
};
