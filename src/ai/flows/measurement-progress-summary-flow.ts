'use server';
/**
 * @fileOverview A Genkit flow for summarizing body measurement changes over a selected period.
 *
 * - measurementProgressSummary - A function that generates an AI-powered summary of measurement changes.
 * - MeasurementProgressSummaryInput - The input type for the measurementProgressSummary function.
 * - MeasurementProgressSummaryOutput - The return type for the measurementProgressSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const MeasurementEntrySchema = z.object({
  timestamp: z.string().datetime().describe('The timestamp of the measurement.'),
  neck: z.number().optional().describe('Neck circumference in cm or inches.'),
  chest: z.number().optional().describe('Chest circumference in cm or inches.'),
  waist: z.number().optional().describe('Waist circumference in cm or inches.'),
  hips: z.number().optional().describe('Hip circumference in cm or inches.'),
  leftBicep: z.number().optional().describe('Left bicep circumference in cm or inches.'),
  rightBicep: z.number().optional().describe('Right bicep circumference in cm or inches.'),
  leftThigh: z.number().optional().describe('Left thigh circumference in cm or inches.'),
  rightThigh: z.number().optional().describe('Right thigh circumference in cm or inches.'),
  leftCalf: z.number().optional().describe('Left calf circumference in cm or inches.'),
  rightCalf: z.number().optional().describe('Right calf circumference in cm or inches.'),
  weight: z.number().optional().describe('Weight in kg or lbs.'),
  height: z.number().optional().describe('Height in cm or inches.'),
});

const MeasurementProgressSummaryInputSchema = z.object({
  sex: z.enum(['male', 'female', 'boy', 'girl']).describe('The sex or gender category of the user.'),
  goal: z.string().optional().describe('The user\u0027s fitness goal (e.g., "lose weight", "gain muscle", "maintain").'),
  measurements: z.array(MeasurementEntrySchema).describe('An array of historical measurement entries.'),
  selectedPeriod: z.object({
    startDate: z.string().datetime().describe('The start date (inclusive) of the period for which to summarize measurements (ISO 8601 format).'),
    endDate: z.string().datetime().describe('The end date (inclusive) of the period for which to summarize measurements (ISO 8601 format).'),
  }).describe('The time period to summarize measurement changes.'),
});

export type MeasurementProgressSummaryInput = z.infer<typeof MeasurementProgressSummaryInputSchema>;

// Helper schema for pre-calculated changes to guide the AI
const MeasurementComparisonDataSchema = z.object({
  measurement: z.string().describe('The name of the body measurement (e.g., "waist", "chest").'),
  initialValue: z.number().optional().describe('The measurement value at the start of the period.'),
  finalValue: z.number().optional().describe('The measurement value at the end of the period.'),
  change: z.number().optional().describe('The numerical change in the measurement.'),
  percentageChange: z.number().optional().describe('The percentage change in the measurement, rounded to 2 decimal places if applicable.'),
  trend: z.enum(['increasing', 'decreasing', 'stable', 'no-data']).describe('The trend of the measurement (increasing, decreasing, stable, or no-data).'),
});

// Output Schema
const KeyChangeSchema = z.object({ // AI will select and rephrase these from calculatedChanges
  measurement: z.string().describe('The name of the body measurement (e.g., "waist", "chest").'),
  initialValue: z.number().optional().describe('The measurement value at the start of the period.'),
  finalValue: z.number().optional().describe('The measurement value at the end of the period.'),
  change: z.number().optional().describe('The numerical change in the measurement.'),
  percentageChange: z.number().optional().describe('The percentage change in the measurement, rounded to 2 decimal places if applicable.'),
  trend: z.enum(['increasing', 'decreasing', 'stable', 'no-data']).describe('The trend of the measurement (increasing, decreasing, stable, or no-data).'),
});

const MeasurementProgressSummaryOutputSchema = z.object({
  overallSummary: z.string().describe('A concise, AI-generated summary of overall measurement changes during the selected period, highlighting key progress or areas for focus.'),
  keyChanges: z.array(KeyChangeSchema).describe('An array of significant measurement changes, selected and potentially rephrased by the AI from the provided data.'),
  recommendations: z.array(z.string()).describe('Personalized recommendations or insights based on the summary, key changes, and user goal.'),
});

export type MeasurementProgressSummaryOutput = z.infer<typeof MeasurementProgressSummaryOutputSchema>;

// Helper function to format measurements for display in the prompt
function formatMeasurements(measurements: z.infer<typeof MeasurementEntrySchema> | undefined): string {
  if (!measurements) return 'No data available.';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(measurements)) {
    if (key !== 'timestamp' && typeof value === 'number') {
      parts.push(`${key}: ${value.toFixed(2)}`); // Format numbers for consistent display
    }
  }
  return parts.length > 0 ? parts.join(', ') : 'No specific measurements recorded.';
}

const measurementSummaryPrompt = ai.definePrompt({
  name: 'measurementSummaryPrompt',
  input: {
    schema: z.object({
      sex: z.enum(['male', 'female', 'boy', 'girl']),
      goal: z.string().describe('The user\u0027s fitness goal (e.g., "lose weight", "gain muscle", "maintain").'),
      periodDescription: z.string().describe('A descriptive string of the period (e.g., "from YYYY-MM-DD to YYYY-MM-DD").'),
      initialMeasurementsFormatted: z.string().describe('Formatted string of initial measurements for the period.'),
      finalMeasurementsFormatted: z.string().describe('Formatted string of final measurements for the period.'),
      calculatedChanges: z.array(MeasurementComparisonDataSchema).describe('Pre-calculated and formatted changes for various body measurements, to guide the AI.'),
    }),
  },
  output: {schema: MeasurementProgressSummaryOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing body measurement data for fitness progress.
Your task is to provide a concise summary of body measurement changes over a specific period, highlight key progress or areas for focus, and offer personalized recommendations.

The user's sex is: {{{sex}}}
The user's fitness goal is: {{{goal}}}
The period analyzed is: {{{periodDescription}}}

Initial measurements:
{{{initialMeasurementsFormatted}}}

Final measurements:
{{{finalMeasurementsFormatted}}}

Here are the key changes detected between the initial and final measurements within this period:
{{#each calculatedChanges}}
  - {{{measurement}}}: Initial: {{#if initialValue}}{{{initialValue}}}{{else}}N/A{{/if}}, Final: {{#if finalValue}}{{{finalValue}}}{{else}}N/A{{/if}}. Change: {{#if change}}{{{change}}}{{else}}N/A{{/if}} ({{#if percentageChange}}{{{percentageChange}}}{{else}}N/A{{/if}}%). Trend: {{{trend}}}.
{{/each}}
{{#unless calculatedChanges}}
  No comparable data or significant changes found for the period.
{{/unless}}

Please analyze the provided measurements and the key changes.
Generate a detailed 'overallSummary' of the user's progress.
From the 'calculatedChanges' list, filter and select the most significant changes (e.g., changes greater than 1 unit or 1% if applicable) to include in the 'keyChanges' array in your output. You can rephrase them if needed but maintain factual accuracy.
Finally, provide 'recommendations' based on the analysis, considering the user's sex and fitness goal. Ensure recommendations are actionable and positive.

Structure your response strictly as a JSON object matching the provided schema.`,
});

export async function measurementProgressSummary(input: MeasurementProgressSummaryInput): Promise<MeasurementProgressSummaryOutput> {
  return measurementProgressSummaryFlow(input);
}

const measurementProgressSummaryFlow = ai.defineFlow(
  {
    name: 'measurementProgressSummaryFlow',
    inputSchema: MeasurementProgressSummaryInputSchema,
    outputSchema: MeasurementProgressSummaryOutputSchema,
  },
  async (input) => {
    const { measurements, selectedPeriod, sex, goal } = input;
    const startDate = new Date(selectedPeriod.startDate);
    const endDate = new Date(selectedPeriod.endDate);

    const filteredMeasurements = measurements
      .filter(m => {
        const timestamp = new Date(m.timestamp);
        return timestamp >= startDate && timestamp <= endDate;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let initialMeasurements: z.infer<typeof MeasurementEntrySchema> | undefined;
    let finalMeasurements: z.infer<typeof MeasurementEntrySchema> | undefined;

    if (filteredMeasurements.length > 0) {
      initialMeasurements = filteredMeasurements[0];
      finalMeasurements = filteredMeasurements[filteredMeasurements.length - 1];
    }

    const periodDescription = `from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;

    const measureKeys: (keyof Omit<z.infer<typeof MeasurementEntrySchema>, 'timestamp'>)[] = [
      'neck', 'chest', 'waist', 'hips', 'leftBicep', 'rightBicep',
      'leftThigh', 'rightThigh', 'leftCalf', 'rightCalf', 'weight', 'height'
    ];

    const calculatedChanges: z.infer<typeof MeasurementComparisonDataSchema>[] = [];

    if (initialMeasurements && finalMeasurements && filteredMeasurements.length > 1) {
      for (const key of measureKeys) {
        const initialValue = initialMeasurements[key];
        const finalValue = finalMeasurements[key];

        if (typeof initialValue === 'number' && typeof finalValue === 'number') {
          const change = finalValue - initialValue;
          const percentageChange = initialValue !== 0 ? (change / initialValue) * 100 : 0;
          let trend: z.infer<typeof KeyChangeSchema>['trend'] = 'stable';
          // Consider a small threshold for 'stable' to avoid noise from minimal changes
          if (change > 0.1) { // Threshold for 'increasing'
            trend = 'increasing';
          } else if (change < -0.1) { // Threshold for 'decreasing'
            trend = 'decreasing';
          }

          calculatedChanges.push({
            measurement: key,
            initialValue: parseFloat(initialValue.toFixed(2)),
            finalValue: parseFloat(finalValue.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            percentageChange: parseFloat(percentageChange.toFixed(2)),
            trend: trend,
          });
        } else if (typeof initialValue === 'number' && typeof finalValue !== 'number') {
            // Measurement present initially but not at the end
            calculatedChanges.push({
                measurement: key,
                initialValue: parseFloat(initialValue.toFixed(2)),
                finalValue: undefined,
                change: undefined,
                percentageChange: undefined,
                trend: 'no-data',
            });
        } else if (typeof initialValue !== 'number' && typeof finalValue === 'number') {
            // Measurement present at the end but not initially
            calculatedChanges.push({
                measurement: key,
                initialValue: undefined,
                finalValue: parseFloat(finalValue.toFixed(2)),
                change: undefined,
                percentageChange: undefined,
                trend: 'no-data',
            });
        }
        // If both are undefined, do not add to calculatedChanges
      }
    } else if (filteredMeasurements.length === 1) {
        // If only one measurement, describe current state but no change
         for (const key of measureKeys) {
            const value = initialMeasurements?.[key]; // initialMeasurements is the single entry here
            if (typeof value === 'number') {
                calculatedChanges.push({
                    measurement: key,
                    initialValue: parseFloat(value.toFixed(2)),
                    finalValue: parseFloat(value.toFixed(2)),
                    change: 0,
                    percentageChange: 0,
                    trend: 'stable',
                });
            } else if (value === undefined) {
                // If measurement is undefined for the single entry, it's 'no-data'
                calculatedChanges.push({
                    measurement: key,
                    initialValue: undefined,
                    finalValue: undefined,
                    change: undefined,
                    percentageChange: undefined,
                    trend: 'no-data',
                });
            }
        }
    }

    // Prepare prompt input
    const promptInput = {
      sex,
      goal: goal || 'fitness progress', // Provide a default goal if none is given
      periodDescription,
      initialMeasurementsFormatted: formatMeasurements(initialMeasurements),
      finalMeasurementsFormatted: formatMeasurements(finalMeasurements),
      calculatedChanges: calculatedChanges,
    };

    const { output } = await measurementSummaryPrompt(promptInput);

    if (!output) {
      throw new Error('AI did not return a valid output for measurement summary.');
    }
    return output;
  }
);
