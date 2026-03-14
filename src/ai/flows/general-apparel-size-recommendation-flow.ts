'use server';
/**
 * @fileOverview A Genkit flow for generating general apparel size recommendations.
 *
 * - generalApparelSizeRecommendation - A function that handles the apparel size recommendation process.
 * - GeneralApparelSizeRecommendationInput - The input type for the generalApparelSizeRecommendation function.
 * - GeneralApparelSizeRecommendationOutput - The return type for the generalApparelSizeRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralApparelSizeRecommendationInputSchema = z.object({
  genderCategory: z.enum(['men', 'women', 'boys', 'girls']).describe('The gender and age category of the person.'),
  heightCm: z.number().positive().describe('Height in centimeters.'),
  weightKg: z.number().positive().describe('Weight in kilograms.'),
  chestBustCm: z.number().positive().describe('Chest or bust circumference in centimeters.'),
  waistCm: z.number().positive().describe('Waist circumference in centimeters.'),
  hipCm: z.number().positive().describe('Hip circumference in centimeters.'),
  inseamCm: z.number().positive().optional().describe('Inseam length in centimeters (optional).'),
  sleeveLengthCm: z.number().positive().optional().describe('Sleeve length in centimeters (optional).'),
  neckCm: z.number().positive().optional().describe('Neck circumference in centimeters (optional).')
});
export type GeneralApparelSizeRecommendationInput = z.infer<typeof GeneralApparelSizeRecommendationInputSchema>;

const GeneralApparelSizeRecommendationOutputSchema = z.object({
  tops: z.string().describe('Recommended size for tops (e.g., S, M, L, XL, US 8, EU 40).'),
  bottoms: z.string().describe('Recommended size for bottoms (e.g., 30x32, US 10, EU 38).'),
  dresses: z.string().optional().describe('Recommended size for dresses (e.g., US 6, M). Only applicable for women/girls.'),
  outerwear: z.string().describe('Recommended size for outerwear (e.g., M, L).'),
  generalNotes: z.string().optional().describe('Any general notes or disclaimers about the recommendations.')
});
export type GeneralApparelSizeRecommendationOutput = z.infer<typeof GeneralApparelSizeRecommendationOutputSchema>;

export async function generalApparelSizeRecommendation(
  input: GeneralApparelSizeRecommendationInput
): Promise<GeneralApparelSizeRecommendationOutput> {
  return generalApparelSizeRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalApparelSizeRecommendationPrompt',
  input: {schema: GeneralApparelSizeRecommendationInputSchema},
  output: {schema: GeneralApparelSizeRecommendationOutputSchema},
  prompt: `You are an expert apparel sizing assistant. Your task is to provide general apparel size recommendations based on the provided body measurements.
Consider standard international sizing conventions, but primarily focus on common US/EU sizing where applicable.
The recommendations should be for a person in the category: {{{genderCategory}}}.

Measurements provided (all in centimeters, weight in kilograms):
- Gender/Category: {{{genderCategory}}}
- Height: {{{heightCm}}}
- Weight: {{{weightKg}}}
- Chest/Bust Circumference: {{{chestBustCm}}}
- Waist Circumference: {{{waistCm}}}
- Hip Circumference: {{{hipCm}}}
{{#if inseamCm}}
- Inseam Length: {{{inseamCm}}}
{{/if}}
{{#if sleeveLengthCm}}
- Sleeve Length: {{{sleeveLengthCm}}}
{{/if}}
{{#if neckCm}}
- Neck Circumference: {{{neckCm}}}
{{/if}}

Provide general size recommendations for the following apparel types: tops, bottoms, and outerwear. If the gender category is 'women' or 'girls', also provide a recommendation for dresses.
Keep in mind that these are general recommendations and actual sizes may vary between brands.

Provide the recommendations in a structured JSON format as described in the output schema.
`
});

const generalApparelSizeRecommendationFlow = ai.defineFlow(
  {
    name: 'generalApparelSizeRecommendationFlow',
    inputSchema: GeneralApparelSizeRecommendationInputSchema,
    outputSchema: GeneralApparelSizeRecommendationOutputSchema
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
