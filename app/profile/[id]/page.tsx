import { DataTabs } from "./_components/tabs";
import { UserData } from "./user-data";

const ProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto max-w-5xl space-y-6">
      <UserData user={params.id} />
      <DataTabs />
    </div>
  );
};

export default ProfilePage;
