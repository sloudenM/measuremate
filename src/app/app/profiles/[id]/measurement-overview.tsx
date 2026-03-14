'use client';

import { useState }from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BodyVisualizer } from '@/components/body-visualizer';
import { AddMeasurementForm } from './add-measurement-form';
import { Label } from '@/components/ui/label';
import { measurementLabels, Measurement, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MeasurementOverviewProps {
  profile: Profile;
  latestMeasurement?: Measurement;
}

export function MeasurementOverview({
  profile,
  latestMeasurement,
}: MeasurementOverviewProps) {
  const [activePoint, setActivePoint] =
    useState<keyof Omit<Measurement, 'id' | 'date'>>();

  const handlePointClick = (point: keyof Omit<Measurement, 'id' | 'date'>) => {
    setActivePoint(point);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Measurements</CardTitle>
        <CardDescription>
          Your most recently recorded measurements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestMeasurement ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <BodyVisualizer
                gender={profile.gender}
                measurements={latestMeasurement}
                onPointClick={handlePointClick}
                activePoint={activePoint}
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.keys(measurementLabels).map((key) => {
                const measurementKey = key as keyof Omit<
                  Measurement,
                  'id' | 'date'
                >;
                const value = latestMeasurement[measurementKey];
                if (value === undefined) return null;
                return (
                  <div
                    key={key}
                    className={cn(
                      'p-4 bg-muted/50 rounded-lg transition-all cursor-pointer hover:bg-primary/10',
                      {
                        'ring-2 ring-primary bg-primary/10':
                          activePoint === measurementKey,
                      }
                    )}
                    onClick={() => handlePointClick(measurementKey)}
                  >
                    <Label className="text-sm text-muted-foreground">
                      {measurementLabels[measurementKey].split('(')[0]}
                    </Label>
                    <p className="text-2xl font-semibold">
                      {value}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        cm
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No measurements recorded yet.
            </p>
            <div className="mt-4">
              <AddMeasurementForm />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
