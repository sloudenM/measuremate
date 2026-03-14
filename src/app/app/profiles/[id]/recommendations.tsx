'use client';

import { useState } from 'react';
import {
  generalApparelSizeRecommendation,
  type GeneralApparelSizeRecommendationInput,
  type GeneralApparelSizeRecommendationOutput,
} from '@/ai/flows/general-apparel-size-recommendation-flow';
import {
  measurementProgressSummary,
  type MeasurementProgressSummaryInput,
  type MeasurementProgressSummaryOutput,
} from '@/ai/flows/measurement-progress-summary-flow';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Profile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export function Recommendations({ profile }: { profile: Profile }) {
  const { toast } = useToast();
  const [loadingApparel, setLoadingApparel] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [apparelResult, setApparelResult] = useState<GeneralApparelSizeRecommendationOutput | null>(null);
  const [summaryResult, setSummaryResult] = useState<MeasurementProgressSummaryOutput | null>(null);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const handleApparelRecommendation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const latestMeasurement = profile.measurements.slice(-1)[0];

    const input: GeneralApparelSizeRecommendationInput = {
      genderCategory: profile.gender,
      heightCm: Number(formData.get('height')) || latestMeasurement?.height || 0,
      weightKg: Number(formData.get('weight')) || latestMeasurement?.weight || 0,
      chestBustCm: Number(formData.get('chest')) || latestMeasurement?.chest || 0,
      waistCm: Number(formData.get('waist')) || latestMeasurement?.waist || 0,
      hipCm: Number(formData.get('hips')) || latestMeasurement?.hips || 0,
    };
    
    if (!input.heightCm || !input.weightKg || !input.chestBustCm || !input.waistCm || !input.hipCm) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields or add a measurement entry.', variant: 'destructive'});
      return;
    }

    setLoadingApparel(true);
    setApparelResult(null);
    try {
      const result = await generalApparelSizeRecommendation(input);
      setApparelResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to get recommendations.', variant: 'destructive' });
    } finally {
      setLoadingApparel(false);
    }
  };

  const handleSummary = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({ title: 'Invalid Date Range', description: 'Please select a start and end date.', variant: 'destructive'});
      return;
    }
    
    const input: MeasurementProgressSummaryInput = {
      sex: profile.gender,
      goal: profile.goal || 'General Fitness',
      measurements: profile.measurements.map(m => ({
        ...m,
        timestamp: new Date(m.date).toISOString()
      })),
      selectedPeriod: {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      },
    };

    setLoadingSummary(true);
    setSummaryResult(null);
    try {
      const result = await measurementProgressSummary(input);
      setSummaryResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate summary.', variant: 'destructive' });
    } finally {
      setLoadingSummary(false);
    }
  }

  const latestMeasurement = profile.measurements.slice(-1)[0] || {};
  const requiredFields = ['height', 'weight', 'chest', 'waist', 'hips'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Apparel Size Recommendation</CardTitle>
          <CardDescription>Get general apparel size recommendations based on your measurements.</CardDescription>
        </CardHeader>
        <form onSubmit={handleApparelRecommendation}>
          <CardContent className="grid gap-4">
            {requiredFields.map(field => (
              <div className="grid gap-2" key={field}>
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)} (cm)</Label>
                <Input id={field} name={field} type="number" step="0.1" defaultValue={latestMeasurement[field as keyof typeof latestMeasurement]} placeholder={`Enter ${field}`} />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button disabled={loadingApparel}>
              {loadingApparel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Get Recommendation
            </Button>
          </CardFooter>
        </form>
        {apparelResult && (
          <CardContent>
            <h3 className="font-semibold mb-2">Recommendation Result:</h3>
            <div className="p-4 bg-muted rounded-lg text-sm grid gap-2">
              <p><strong>Tops:</strong> {apparelResult.tops}</p>
              <p><strong>Bottoms:</strong> {apparelResult.bottoms}</p>
              {apparelResult.dresses && <p><strong>Dresses:</strong> {apparelResult.dresses}</p>}
              <p><strong>Outerwear:</strong> {apparelResult.outerwear}</p>
              {apparelResult.generalNotes && <p className="mt-2 text-xs text-muted-foreground">{apparelResult.generalNotes}</p>}
            </div>
          </CardContent>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fitness Progress Summary</CardTitle>
          <CardDescription>Generate an AI-powered summary of your measurement changes over a selected period.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select Period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSummary} disabled={loadingSummary}>
            {loadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Generate Summary
          </Button>
        </CardFooter>
        {summaryResult && (
          <CardContent>
             <h3 className="font-semibold mb-2">Summary Result:</h3>
             <div className="p-4 bg-muted rounded-lg text-sm grid gap-4">
              <div>
                <h4 className="font-medium">Overall Summary</h4>
                <p>{summaryResult.overallSummary}</p>
              </div>
              <div>
                <h4 className="font-medium">Key Changes</h4>
                <ul className="list-disc pl-5">
                  {summaryResult.keyChanges.map((change, index) => (
                    <li key={index}>
                      <strong>{change.measurement}: </strong> 
                       {change.trend === 'increasing' ? 'Increased' : 'Decreased'} by {Math.abs(change.change || 0)} from {change.initialValue} to {change.finalValue}.
                    </li>
                  ))}
                </ul>
              </div>
               <div>
                <h4 className="font-medium">Recommendations</h4>
                <ul className="list-disc pl-5">
                  {summaryResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
             </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
