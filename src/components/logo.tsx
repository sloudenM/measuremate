import { cn } from '@/lib/utils';
import { LogoGraphic } from './logo-graphic';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoGraphic />
      <span className="text-xl font-bold tracking-tight">MeasureMate</span>
    </div>
  );
}
