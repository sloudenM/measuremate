import { getProfileById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProfileClientPage } from './profile-client-page';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = getProfileById(params.id);

  if (!profile) {
    notFound();
  }

  return <ProfileClientPage profile={profile} />;
}
