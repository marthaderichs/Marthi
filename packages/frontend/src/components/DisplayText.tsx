import React from 'react';

const MAP: Record<string, string> = {
  ä: 'ae', ö: 'oe', ü: 'ue',
  Ä: 'Ae', Ö: 'Oe', Ü: 'Ue',
  ß: 'ss',
};

/**
 * Replaces German umlauts with two-letter equivalents so Tiny SSO Main
 * can render them without any font fallback issues.
 */
export function DisplayText({ children }: { children: string }) {
  return <>{children.replace(/[äöüÄÖÜß]/g, ch => MAP[ch] ?? ch)}</>;
}
