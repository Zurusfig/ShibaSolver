'use client';

import { useEffect, useRef } from 'react';

// Google renders the button as a fixed-width iframe, so give it an explicit
// width and center it rather than letting it sit at the container's left edge.
const BUTTON_OPTIONS = {
  theme: 'outline',
  size: 'large',
  width: 320,
  type: 'standard',
  text: 'signin_with',
  shape: 'rectangular',
  logo_alignment: 'left',
} as const;

interface GoogleSignInButtonProps {
  onSuccess: (response: any) => void;
  className?: string;
}

export default function GoogleSignInButton({ onSuccess, className = "" }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      // Load Google OAuth script
      if (window.google && buttonRef.current) {
        // Clear any existing button content first
        buttonRef.current.innerHTML = '';
        
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: onSuccess,
        });

        window.google.accounts.id.renderButton(buttonRef.current, BUTTON_OPTIONS);
        return;
      }

      if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && buttonRef.current) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
              callback: onSuccess,
            });

            window.google.accounts.id.renderButton(buttonRef.current, BUTTON_OPTIONS);
          }
        };
        document.head.appendChild(script);
      }
    };

    const timer = setTimeout(initializeGoogleAuth, 100);
    
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className={`w-full ${className}`}>
      <div ref={buttonRef} className="flex justify-center min-h-[44px]"></div>
    </div>
  );
}
