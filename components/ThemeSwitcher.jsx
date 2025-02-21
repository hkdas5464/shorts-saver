import { useTheme } from 'next-themes';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
      style={{
        padding: '0.5rem 1rem',
        border: 'none',
        background: '#333',
        color: '#fff',
        cursor: 'pointer'
      }}
    >
      Toggle Dark Mode
    </button>
  );
}
