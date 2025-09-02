"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/atoms/admin/input";

export default function AdminHeaderSearch() {
  return (
    <>
      <div className="relative  w-md">
        <Search
          strokeWidth={1.5}
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="search"
          placeholder="Pretražite stanje, pomoć i još mnogo toga (Alt + Z)"
          className="w-full pl-12 pr-4 h-9 rounded-xs bg-white/10 border-white/10 shadow-xs placeholder:text-gray-400 focus:bg-white focus:placeholder:text-gray-300"
        />
      </div>
    </>
  );
}
