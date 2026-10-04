"use client";
import ShibaIcon from "@/components/auth/ShibaIcon";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import GuestContinueButton from "@/components/auth/GuestContinueButton";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect } from "react";

export default function SignupPage() {
  const { handleGoogleResponse, handleGuestContinue } = useGoogleAuth();
  const { user, isLoading, error } = useCurrentUser();

  // Trust the session, not localStorage: a leftover username from an expired
  // session used to redirect here forever and hide the sign-in button.
  useEffect(() => {
    if (isLoading) return;
    if (user?.user_name) {
      window.location.href = `/user/${user.user_name}`;
    } else if (error) {
      localStorage.removeItem("username");
      localStorage.removeItem("authToken");
    }
  }, [user, isLoading, error]);


  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-display">
      <div className="bg-purple-100 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-dark-900 mb-2">Sign in to</h1>
          <h1 className="text-5xl font-bold text-dark-900">Shiba Solver</h1>
        </div>

        {/* Shiba Inu Icon */}
        <div className="mb-8 flex justify-center">
          <ShibaIcon />
        </div>

        {/* Google Sign In Button */}
        <div className="mb-4">
          <GoogleSignInButton onSuccess={handleGoogleResponse} />
        </div>

        {/* Continue as Guest Link */}
        <GuestContinueButton onClick={handleGuestContinue} />
      </div>
    </div>
  );
}
