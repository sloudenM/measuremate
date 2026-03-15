import Link from 'next/link';
import Image from 'next/image';
import {
  Ruler,
  Users,
  LineChart,
  Bot,
  Database,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

const features = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'User Profiles & Measurements',
    description:
      'Create individual profiles and accurately input a comprehensive set of head-to-toe body measurements.',
  },
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: 'Measurement Tracking & History',
    description:
      'Display a timeline of recorded measurements, allowing users to review their progress over time.',
  },
  {
    icon: <Ruler className="w-8 h-8 text-primary" />,
    title: 'Visual Measurement Overview',
    description:
      'A simplified visual representation of the body to highlight measured areas and provide a quick data overview.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Fitness & Fit Recommendation',
    description:
      'Utilize AI to provide personalized feedback on fitness progress or recommend general apparel sizing.',
  },
  {
    icon: <Database className="w-8 h-8 text-primary" />,
    title: 'Secure Data Storage',
    description:
      'Safely store all user profiles and sensitive measurement data in a managed database solution.',
  },
  {
    icon: <Lock className="w-8 h-8 text-primary" />,
    title: 'User Authentication',
    description:
      'Securely register and log in to protect your personal measurement data and access your profiles.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 font-headline">
              Know Your Body. Master Your Fit.
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
              Track your measurements, visualize your progress, and get AI-powered
              recommendations for fitness and fashion.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="relative rounded-xl overflow-hidden border shadow-lg">
                <Image
                  src="https://i.ibb.co/8n7yKxPL/Gemini-Generated-Image-dunkusdunkusdunk.png"
                  alt="MeasureMate App Screenshot"
                  width={1200}
                  height={800}
                  data-ai-hint="fitness measurement"
                  className="w-full"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
                A Complete Measurement Toolkit
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                MeasureMate provides all the tools you need to track your body
                measurements with precision and ease.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl border flex flex-col items-start gap-4 transition-transform transform hover:-translate-y-1"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold font-headline">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} MeasureMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
