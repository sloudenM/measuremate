'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { type GenderCategory, type Measurement } from '@/lib/types';
import { MaleBody } from './male-body';
import { FemaleBody } from './female-body';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type BodyPoint = {
  key: keyof Omit<Measurement, 'id' | 'date'>;
  label: string;
  x: number;
  y: number;
};

const points: BodyPoint[] = [
  { key: 'neck', label: 'Neck', x: 50, y: 28 },
  { key: 'chest', label: 'Chest', x: 50, y: 55 },
  { key: 'sleeveLength', label: 'Sleeve', x: 8, y: 105 },
  { key: 'waist', label: 'Waist', x: 50, y: 80 },
  { key: 'hips', label: 'Hips', x: 50, y: 100 },
  { key: 'leftBicep', label: 'Bicep', x: 20, y: 68 },
  { key: 'rightBicep', label: 'Bicep', x: 80, y: 68 },
  { key: 'inseam', label: 'Inseam', x: 50, y: 155 },
  { key: 'leftThigh', label: 'Thigh', x: 40, y: 130 },
  { key: 'rightThigh', label: 'Thigh', x: 60, y: 130 },
  { key: 'leftCalf', label: 'Calf', x: 38, y: 180 },
  { key: 'rightCalf', label: 'Calf', x: 62, y: 180 },
];

interface BodyVisualizerProps {
  gender: GenderCategory;
  measurements?: Partial<Omit<Measurement, 'id' | 'date'>>;
  onPointClick: (point: keyof Omit<Measurement, 'id' | 'date'>) => void;
  activePoint?: keyof Omit<Measurement, 'id' | 'date'>;
}

export function BodyVisualizer({ gender, measurements, onPointClick, activePoint }: BodyVisualizerProps) {
  const isMale = gender === 'men' || gender === 'boys';
  const BodyModel = isMale ? MaleBody : FemaleBody;

  return (
    <div className="relative w-full max-w-[200px] mx-auto text-muted-foreground">
      <BodyModel />
      <TooltipProvider>
        {points.map((point) => (
          <Tooltip key={point.key} delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onPointClick(point.key)}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted-foreground/50 hover:bg-primary transition-colors',
                  {
                    'bg-accent ring-2 ring-accent-foreground': !!measurements?.[point.key],
                    'bg-primary ring-2 ring-primary-foreground scale-125': activePoint === point.key,
                  }
                )}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                aria-label={point.label}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {point.label}: {measurements?.[point.key] ? `${measurements[point.key]} cm` : 'N/A'}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
