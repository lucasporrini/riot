"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/profile/BANDEUR%202%20NIECES-NIECE">
        <Button>Click me</Button>
      </Link>
      <Link href="/users">
        <Button>Users</Button>
      </Link>
    </div>
  );
}
