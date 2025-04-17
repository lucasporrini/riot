import Link from "next/link";

import { ModeToggle } from "../themes/toggle-button";
import { SearchBar } from "./search-bar";

export const Header = () => {
  return (
    <div className="w-full flex items-center">
      <div className="w-full bg-background mx-auto max-w-5xl flex items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="text-lg font-bold">Header</span>
          </Link>
          <SearchBar />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};
