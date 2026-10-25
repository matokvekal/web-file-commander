import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import browserFolderAccess from './access/browserFolderAccess';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App access={browserFolderAccess} />
  </StrictMode>
);
