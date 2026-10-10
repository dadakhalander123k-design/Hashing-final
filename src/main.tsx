import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './utils/themeContext.tsx';
import { progressManager } from './utils/progressManager.ts';
import { pointsManager } from './utils/pointsManager.ts';
import './index.css';

// Perform user-requested progress reset
try {
  const RESET_KEY = 'hash_quest_reset_applied_flag';
  const CURRENT_RESET_ID = 'user_reset_2026_10_10';
  if (localStorage.getItem(RESET_KEY) !== CURRENT_RESET_ID) {
    progressManager.resetProgress();
    pointsManager.resetAll();
    localStorage.removeItem('hash_quest_quiz_answers_v3');
    localStorage.removeItem('hash_quest_quiz_submitted_v3');
    localStorage.setItem(RESET_KEY, CURRENT_RESET_ID);
  }
} catch {
  // Ignore storage errors
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
