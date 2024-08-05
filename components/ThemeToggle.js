import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';

const ThemeToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setEnabled(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      setEnabled(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setEnabled(!enabled);
    if (enabled) {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <SunIcon className="h-6 w-6 text-yellow-500" />
      <Switch
        checked={enabled}
        onChange={toggleTheme}
        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
      >
        <span className="sr-only">Enable dark mode</span>
        <span
          className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`}
        />
      </Switch>
      <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
    </div>
  );
};

export default ThemeToggle;
