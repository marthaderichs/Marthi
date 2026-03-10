import React from 'react';

/**
 * Renders a string in the display font with umlauts (ä ö ü Ä Ö Ü ß)
 * wrapped in a 0.78em span so the Gochi Hand fallback doesn't look oversized
 * next to Tiny SSO Main characters.
 */
export function DisplayText({ children }: { children: string }) {
  const parts = children.split(/([äöüÄÖÜß])/g);
  return (
    <>
      {parts.map((part, i) =>
        /^[äöüÄÖÜß]$/.test(part)
          ? <span key={i} style={{ fontFamily: '"Just Me Again Down Here", "Gochi Hand", cursive' }}>{part}</span>
          : <React.Fragment key={i}>{part}</React.Fragment>
      )}
    </>
  );
}
