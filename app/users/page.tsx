import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchBar } from "./search-bar";

const UsersPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
