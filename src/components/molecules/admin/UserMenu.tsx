// src/components/molecules/admin/UserMenu.tsx
"use client";
import React from "react";
import { useEffect, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
// import { deleteUser } from "@/actions/UserActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/admin/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { Link } from "@/i18n/navigation";

interface SessionData {
  status: number;
  authenticated: boolean;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    id: string;
  };
  error?: string;
}

export default function UserMenu() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data: SessionData = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession({
          status: 500,
          error: "Failed to fetch session",
          authenticated: false,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    signOut();
  };

  // const handleDelete = async () => {
  //   try {
  //     if (session?.user?.id) {
  //       await deleteUser(session.user.id);
  //       signOut();
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete user:", error);
  //   }
  // };

  if (isLoading) {
    return <Avatar className="w-10 h-10 animate-pulse bg-bluee-100" />;
  }

  if (!session?.user) {
    return (
      <Button variant="ghost" asChild>
        <Link href={"/sign-in" as never}>Log in</Link>
      </Button>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full focus:ring-0 focus:ring-offset-0"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={session.user.image || undefined}
              alt={session.user.name || "User"}
              className="bg-blue-50"
            />
            <AvatarFallback className="bg-blue-50">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-92 bg-gray-100 p-0"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal shadow-xs rounded-b-sm border-b border-gray-200 bg-white">
          <div className="flex space-y-1 p-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={session.user.image || undefined}
                alt={session.user.name || "User"}
                className="bg-blue-50"
              />
              <AvatarFallback className="bg-blue-50">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center space-y-2 pl-4">
              <p className="tracking-tight  font-semibold  text-gray-800 leading-none">
                {session.user.name}
              </p>
              <p className="tracking-tight text-xs  leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <div className="flex mb-3 justify-start space-x-1 pr-4 pl-10">
            <Button size="sm" className="w-1/2" variant="outline">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button
              size="sm"
              className="w-1/2"
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="py-3 flex text-xs justify-center">
          Made by{" "}
          <Link className="font-bold underline" href={"https://www.msk.hr" as never}>
            msk.hr
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
