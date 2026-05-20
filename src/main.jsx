import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from '@/features/auth/store/authContext';
import { BookingProvider } from '@/features/booking/store/bookingContext';
import { LanguageProvider } from '@/features/i18n/store/languageContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
);

