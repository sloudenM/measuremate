import { cn } from '@/lib/utils';

export function LogoGraphic({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <g transform="translate(5,0) scale(0.9)">
        {/* Tape Behind */}
        <path d="M 10,50 C 40,25 60,25 90,50" stroke="hsl(var(--accent))" strokeWidth="14" fill="none" strokeLinecap="round"/>
        
        {/* Figure */}
        <path d="M50,8 a10,10 0 1,1 0,20 a10,10 0 1,1 0,-20" fill="hsl(var(--primary))"/>
        <path d="M42,25 C 40,45 50,40 52,55 C 55,80 40,80 35,95" stroke="hsl(var(--primary))" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M42,25 L20,15" stroke="hsl(var(--primary))" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M52,55 L85,40" stroke="hsl(var(--primary))" strokeWidth="12" fill="none" strokeLinecap="round"/>
        
        {/* Tape Front */}
        <path d="M20,70 C40,95 70,95 80,70" stroke="hsl(var(--accent))" strokeWidth="14" fill="none" strokeLinecap="round"/>
        
        {/* Tape Markings */}
        <g stroke="hsl(var(--accent-foreground))" strokeWidth="2.5" strokeLinecap="round">
            <line x1="20" y1="46" x2="22" y2="44" />
            <line x1="30" y1="36" x2="32" y2="34" />
            <line x1="40" y1="30" x2="42" y2="28" />
            <line x1="50" y1="28" x2="50" y2="26" />
            <line x1="60" y1="30" x2="58" y2="28" />
            <line x1="70" y1="36" x2="68" y2="34" />
            <line x1="80" y1="46" x2="78" y2="44" />

            <line x1="30" y1="80" x2="32" y2="78" />
            <line x1="40" y1="88" x2="42" y2="86" />
            <line x1="50" y1="90" x2="50" y2="88" />
            <line x1="60" y1="88" x2="58" y2="86" />
            <line x1="70" y1="80" x2="68" y2="78" />
        </g>
      </g>
    </svg>
  );
}
