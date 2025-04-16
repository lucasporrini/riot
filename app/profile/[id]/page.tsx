import { UserData } from "./user-data";

const ProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <UserData userId={params.id} />
    </div>
  );
};

export default ProfilePage;
