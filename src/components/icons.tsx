type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.02L2 22l5.12-1.53A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.04.9.92-2.96-.2-.31a8.2 8.2 0 1 1 6.8 3.7Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04c0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7 1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.15-1.17-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 3.5h3l1.5 4-2 1.2a11 11 0 0 0 5.8 5.8l1.2-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

// The hand-drawn "hair strand" line under the hero title.
export function Strand({ className }: IconProps) {
  return (
    <svg viewBox="0 0 320 24" aria-hidden="true" className={`strand ${className ?? ""}`} fill="none">
      <path
        pathLength={1}
        d="M2 14c28-10 52-10 76-2s46 10 70 2 46-12 72-4 48 8 98-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
