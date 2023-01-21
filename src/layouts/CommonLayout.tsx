import { useTheme } from '@/hooks';
import { PropsWithChildren } from 'react';
import { themes } from '@/consts';
import { Logo } from './Logo';

type CommonLayoutProps = PropsWithChildren<{
  nav: JSX.Element;
}>;

export function CommonLayout({ children, nav }: CommonLayoutProps) {
  const [theme, handleThemeChange] = useTheme();

  return (
    <div className="overflow-hidden">
      <div className="sticky shadow top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 bg-base-100 text-base-content">
        <nav className="navbar w-full">
          <span
            className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)] lg:hidden"
            data-tip="Menu"
          >
            <label
              htmlFor="drawer"
              className="btn btn-square btn-ghost drawer-button lg:hidden"
            >
              <i className="material-icons">menu</i>
            </label>
          </span>
          <div className="z-20 bg-opacity-90 backdrop-blur sticky top-0 items-center gap-2 px-4 py-2">
            <Logo />
          </div>
          <div className="ml-auto">
            <select
              className="select"
              onChange={handleThemeChange}
              value={theme}
            >
              <option value="" defaultValue="" hidden>
                Theme
              </option>
              {themes.map((themeItem) => (
                <option value={themeItem} key={themeItem}>
                  {themeItem}
                </option>
              ))}
              <option value="dark">Dark</option>
            </select>
          </div>
        </nav>
      </div>
      <div className="drawer drawer-mobile">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <main className="drawer-content bg-base-100 p-4 overflow-auto">
          {children}
        </main>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay" />
          <aside className="bg-base-200 w-80 sticky">{nav}</aside>
        </div>
      </div>
    </div>
  );
}
