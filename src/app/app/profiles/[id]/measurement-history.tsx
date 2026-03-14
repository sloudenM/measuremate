'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import type { Measurement, Profile } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { measurementLabels } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type MeasurementKey = keyof Omit<Measurement, 'id' | 'date'>;

export function MeasurementHistory({ profile }: { profile: Profile }) {
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<MeasurementKey>('weight');

  const chartData = profile.measurements
    .map((m) => ({
      date: format(new Date(m.date), 'MMM d, yyyy'),
      value: m[selectedMeasurement],
    }))
    .filter((d) => d.value !== undefined && d.value !== null);

  const availableMeasurements = Object.keys(measurementLabels).filter(
    (key) =>
      profile.measurements.some((m) => m[key as MeasurementKey] !== undefined)
  ) as MeasurementKey[];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Measurement Trend</CardTitle>
          <CardDescription>
            Visualize the change of a specific measurement over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="measurement-select">Select Measurement:</label>
            <Select
              value={selectedMeasurement}
              onValueChange={(value) => setSelectedMeasurement(value as MeasurementKey)}
            >
              <SelectTrigger className="w-[200px]" id="measurement-select">
                <SelectValue placeholder="Select measurement" />
              </SelectTrigger>
              <SelectContent>
                {availableMeasurements.map((key) => (
                  <SelectItem key={key} value={key}>
                    {measurementLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {chartData.length > 1 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  hide
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    fill: 'hsl(var(--primary))',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              <p>Not enough data to display a trend. Add at least two measurements.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
          <CardDescription>A detailed log of all recorded measurements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {availableMeasurements.map((key) => (
                  <TableHead key={key} className="text-right">
                    {measurementLabels[key].split('(')[0].trim()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {profile.measurements.map((measurement) => (
                <TableRow key={measurement.id}>
                  <TableCell>
                    {format(new Date(measurement.date), 'PP')}
                  </TableCell>
                  {availableMeasurements.map((key) => (
                    <TableCell key={key} className="text-right">
                      {measurement[key] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
