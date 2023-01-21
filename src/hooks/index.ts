import { useState, useEffect, ChangeEventHandler } from 'react';

export const useDomReady = () => {
  const [isDomReady, setIsDomReady] = useState(false);

  useEffect(() => {
    setIsDomReady(typeof document !== 'undefined');
  }, []);

  return isDomReady;
};

export const useTheme = (): [string, ChangeEventHandler<HTMLSelectElement>] => {
  const [theme, setTheme] = useState(
    typeof document !== 'undefined'
      ? window.localStorage.getItem('app-color') ?? 'light'
      : 'light',
  );

  useEffect(() => {
    document
      .querySelector('html')
      ?.setAttribute(
        'data-theme',
        window.localStorage.getItem('app-color') || 'light',
      );
  }, [theme]);

  const handleThemeChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    window.localStorage.setItem('app-color', event.currentTarget.value);
    setTheme(event.currentTarget.value);
  };

  return [theme, handleThemeChange];
};
