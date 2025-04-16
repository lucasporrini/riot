import { SearchBar } from "./search-bar";

const UsersPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <SearchBar />
      </div>
    </div>
  );
};

export default UsersPage;
