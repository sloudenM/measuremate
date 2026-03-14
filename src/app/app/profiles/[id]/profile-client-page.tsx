'use client';

import type { Profile } from '@/lib/types';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppHeader } from '@/components/app/app-header';
import { MeasurementHistory } from './measurement-history';
import { Recommendations } from './recommendations';
import { AddMeasurementForm } from './add-measurement-form';
import { MeasurementOverview } from './measurement-overview';

export function ProfileClientPage({ profile }: { profile: Profile }) {
  const latestMeasurement =
    profile.measurements.length > 0
      ? profile.measurements.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
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
            <MeasurementOverview
              profile={profile}
              latestMeasurement={latestMeasurement}
            />
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
