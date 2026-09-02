"use client";

import { useState, useEffect } from "react";
import UserAvatar from "@/components/common/UserAvatar";

type Props = {
  src?: string;
  alt?: string;
  size?: number | string; // px or CSS size (fallback if responsiveSize not provided)
  responsiveSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
};

export default function ProfilePic({ src, alt, size, responsiveSize }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to prevent hydration mismatch
    return (
      <div
        style={{
          width: typeof size === 'string' ? size : (size ?? (responsiveSize?.xs ?? 160)),
          height: typeof size === 'string' ? size : (size ?? (responsiveSize?.xs ?? 160)),
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  if (responsiveSize) {
    return (
      <UserAvatar
        name={alt}
        src={src}
        className="h-28 w-28 text-4xl md:h-36 md:w-36 md:text-5xl lg:h-40 lg:w-40 lg:text-6xl"
      />
    );
  }

  return <UserAvatar name={alt} src={src} size={typeof size === "number" ? size : 160} />;
}
