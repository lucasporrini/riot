import { DataTabs } from "./_components/tabs";
import { UserData } from "./user-data";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      <UserData user={params.id} />
      <DataTabs />
    </div>
  );
}
