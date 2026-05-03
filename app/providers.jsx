"use client";

import { MagneticCursor, SoundProvider } from "@/components/shared";

/** Sound + accessibility-friendly cursor overlay for every route. */
export default function Providers({ children }) {
  return (
    <SoundProvider>
      <MagneticCursor />
      {children}
    </SoundProvider>
  );
}
