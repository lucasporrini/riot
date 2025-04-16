import { UserData } from "./user-data";

const ProfilePage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto max-w-5xl">
      <UserData userId={params.id} />
    </div>
  );
};

export default ProfilePage;
