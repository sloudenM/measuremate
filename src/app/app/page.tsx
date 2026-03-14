import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { profiles } from '@/lib/data';
import { AppHeader } from '@/components/app/app-header';

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">My Profiles</h1>
          <Button asChild>
            <Link href="/app/profiles/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Profile
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <Image
                  alt="Profile picture"
                  className="rounded-full"
                  height="64"
                  src={profile.avatarUrl}
                  style={{
                    aspectRatio: '64/64',
                    objectFit: 'cover',
                  }}
                  width="64"
                  data-ai-hint="profile picture"
                />
                <div className="grid gap-1">
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription className="capitalize">
                    {profile.gender}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {profile.measurements.length} measurement entries
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/app/profiles/${profile.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
           <Card className="flex flex-col items-center justify-center border-2 border-dashed">
            <CardHeader>
              <CardTitle>Add New Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <Button size="lg" variant="outline" className="h-16 w-16 rounded-full p-0" asChild>
                <Link href="/app/profiles/new">
                  <PlusCircle className="h-8 w-8" />
                </Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">Create a new profile for a family member.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
