"use client";

import { useEffect, useState } from "react";

/**
 * The single place an author avatar is rendered.
 *
 * When a user has a picture we show it. When they don't -- or when the URL
 * fails to load -- we fall back to their initial on a colour derived from
 * their name, rather than to another image that can itself go missing.
 *
 * A bare <img> whose src is null renders the browser's broken-image icon
 * followed by the alt text, which escapes the circle and breaks the layout.
 * Guarding with `onError` alone does not help: an <img> with no src attribute
 * never attempts a load, so no error event is ever fired.
 */

type Props = {
  /** Display name. Provides the initial, the colour, and the accessible label. */
  name?: string | null;
  /** Profile picture URL. Null, empty, or failing values fall back to the initial. */
  src?: string | null;
  /** Size in px. Omit to size with `className` instead (e.g. responsive widths). */
  size?: number;
  className?: string;
};

/**
 * Distinct hues so different authors are easy to tell apart at a glance.
 * Each is dark enough to carry white text at WCAG AA contrast (>= 4.5:1).
 */
const TONES = [
  "#6D28D9", // violet
  "#3730A3", // indigo
  "#0369A1", // sky
  "#0F766E", // teal
  "#047857", // emerald
  "#B45309", // amber
  "#C2410C", // orange
  "#BE123C", // rose
  "#A21CAF", // fuchsia
  "#475569", // slate
] as const;

/**
 * Many callers substitute the bundled default image when a user has no
 * picture. Treat it as "no picture" so everyone without a photo gets the
 * same initial avatar instead of a mix of initials and the stock image.
 */
function isRealPicture(src?: string | null): src is string {
  return Boolean(src && src.trim() && !src.includes("DefaultAvatar"));
}

/** Stable per-user colour: the same name always gets the same tone. */
function toneFor(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return TONES[Math.abs(hash) % TONES.length];
}

/** First letter, uppercased. Falls back to a neutral glyph for blank or symbol-only names. */
function initialFor(name: string): string {
  const first = Array.from(name.trim())[0];
  if (!first) return "?";
  return /\p{L}|\p{N}/u.test(first) ? first.toUpperCase() : "?";
}

export default function UserAvatar({ name, src, size, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  // A row can be recycled onto a different user as lists re-render; without
  // this, one broken picture would suppress the next user's working one.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const label = (name ?? "").trim();
  const showImage = isRealPicture(src) && !failed;

  const sizing = size !== undefined ? { width: size, height: size } : undefined;

  return (
    <span
      role="img"
      aria-label={label ? `${label}'s avatar` : "User avatar"}
      title={label || undefined}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none ${className}`}
      style={{
        ...sizing,
        // Only paint a background behind the letter; a photo covers the circle.
        backgroundColor: showImage ? undefined : toneFor(label || "?"),
      }}
    >
      {showImage ? (
        <img
          src={src as string}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-display font-semibold leading-none text-white"
          style={size !== undefined ? { fontSize: Math.round(size * 0.42) } : undefined}
        >
          {initialFor(label)}
        </span>
      )}
    </span>
  );
}
