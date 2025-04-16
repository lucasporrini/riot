"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  const handleClick = () => {
    toast.success("Hello world!");
  };

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
      <Link href="/users">
        <Button>Users</Button>
      </Link>
    </div>
  );
}
