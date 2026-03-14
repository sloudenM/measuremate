import { getProfileById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppHeader } from '@/components/app/app-header';
import { BodyVisualizer } from '@/components/body-visualizer';
import { MeasurementHistory } from './measurement-history';
import { Recommendations } from './recommendations';
import { measurementLabels, Measurement } from '@/lib/types';
import { AddMeasurementForm } from './add-measurement-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = getProfileById(params.id);

  if (!profile) {
    notFound();
  }

  const latestMeasurement =
    profile.measurements.length > 0
      ? profile.measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : undefined;

  return (
    <>
      <AppHeader title={profile.name} />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center gap-4">
          <Image
            alt="Profile picture"
            className="rounded-full border"
            height="80"
            src={profile.avatarUrl}
            width="80"
            data-ai-hint="profile picture"
          />
          <div>
            <h1 className="text-2xl font-bold font-headline">{profile.name}</h1>
            <p className="text-muted-foreground capitalize">{profile.gender}</p>
          </div>
          <div className="ml-auto">
            <AddMeasurementForm />
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
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
                      <BodyVisualizer gender={profile.gender} measurements={latestMeasurement} onPointClick={()=>{}} />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Object.keys(measurementLabels).map((key) => {
                          const measurementKey = key as keyof Omit<Measurement, 'id'|'date'>;
                          const value = latestMeasurement[measurementKey];
                          if (value === undefined) return null;
                          return (
                            <div key={key} className="p-4 bg-muted/50 rounded-lg">
                              <Label className="text-sm text-muted-foreground">{measurementLabels[measurementKey].split('(')[0]}</Label>
                              <p className="text-2xl font-semibold">{value} <span className="text-sm font-normal text-muted-foreground">cm</span></p>
                            </div>
                          )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No measurements recorded yet.</p>
                    <div className="mt-4">
                      <AddMeasurementForm />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <MeasurementHistory profile={profile} />
          </TabsContent>
          <TabsContent value="recommendations">
            <Recommendations profile={profile} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
