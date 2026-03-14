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
      <g transform="scale(1.2) translate(-8, -5)">
        {/* Figure */}
        <path
          d="M50 10 C 45 10, 40 15, 40 20 C 40 25, 45 30, 50 30 C 55 30, 60 25, 60 20 C 60 15, 55 10, 50 10 Z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M 48 30 L 52 30 L 55 55 L 45 55 Z"
          fill="hsl(var(--primary))"
        />
        {/* Arms */}
        <path
          d="M 45 35 C 30 25, 15 40, 20 50"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
         <path
          d="M 55 35 C 70 25, 85 40, 80 50"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Legs */}
         <path
          d="M 45 55 L 30 80 L 35 95"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 55 55 C 65 70, 60 85, 75 90"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tape */}
        <path
          d="M 90 40 C 60 20, 40 40, 30 60 S 20 85, 50 80"
          stroke="hsl(var(--accent))"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tape markings */}
        <line x1="83" y1="33" x2="86" y2="30" stroke="white" strokeWidth="2" />
        <line x1="73" y1="29" x2="76" y2="26" stroke="white" strokeWidth="2" />
        <line x1="63" y1="29" x2="66" y2="26" stroke="white" strokeWidth="2" />
        <line x1="53" y1="33" x2="56" y2="30" stroke="white" strokeWidth="2" />
        <line x1="43" y1="41" x2="46" y2="38" stroke="white" strokeWidth="2" />
        <line x1="33" y1="52" x2="36" y2="49" stroke="white" strokeWidth="2" />
        <line x1="26" y1="65" x2="29" y2="62" stroke="white" strokeWidth="2" />
        <line x1="24" y1="75" x2="27" y2="72" stroke="white" strokeWidth="2" />
        <line x1="34" y1="81" x2="37" y2="78" stroke="white" strokeWidth="2" />
        <line x1="44" y1="81" x2="47" y2="78" stroke="white" strokeWidth="2" />
      </g>
    </svg>
  );
}
