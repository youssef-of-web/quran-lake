import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [preferredTheme, setPreferredTheme] = useState('light');

  useEffect(() => {
    setPreferredTheme(localStorage.getItem('theme') || 'light');
  }, []);

  return (
    <>
      <Image
        onClick={() => {
          const newTheme = preferredTheme === 'dark' ? 'light' : 'dark';
          setTheme(newTheme);
          setPreferredTheme(newTheme);
        }}
        src={preferredTheme === 'dark' ? '/light_mode.svg' : '/dark_mode.svg'}
        width={30}
        height={30}
        className='cursor-pointer'
        alt={preferredTheme === 'dark' ? 'light mode' : 'dark mode'}
      />
    </>
  );
};
