// Small line-art icon set replacing emoji in Sequence's UI. Matches the
// style the header's stats icon already established (24x24 viewBox,
// stroke-based, currentColor, rounded caps). Share text is NOT touched
// by this: it's plain text sent via SMS/clipboard (the emoji grid
// itself, and the "Noodle Games: N/M solved" header in shareAll.js), so
// those stay real Unicode characters since a custom icon can't survive
// that trip.
function base(props) {
  return { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true, ...props };
}

export function IconDrag({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M9 3v8M9 11l-2.5-2M9 11l2.5-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="12" width="10" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 15.5c2.2-1 4 .3 4 2.3s-1.8 3.3-4 2.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconTarget({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function IconShare({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M12 15V4M12 4l-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconClipboard({ size = 44, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <rect x="6" y="4.5" width="12" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="9" y="3" width="6" height="3" rx="1.2" fill="currentColor" />
      <path d="M9 11h6M9 14.5h6M9 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheckmark({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconXSmall({ size = 12, ...props }) {
  return (
    <svg width={size} height={size} {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
