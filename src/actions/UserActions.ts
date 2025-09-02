"use server";

import type { CreateUserData, UpdateUserData, User } from "@/types/user";
import { revalidateTag, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

// Cache tagovi za različite scenarije
const CACHE_TAGS = {
  ALL_USERS: "users:all",
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
} as const;

// Kreiranje korisnika (admin funkcija)
export async function createUser(data: CreateUserData) {
  try {
    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        image: data.image,
      },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_USERS);
    revalidateTag(CACHE_TAGS.USER_BY_EMAIL(data.email));

    return { success: true, data: user };
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email već postoji u bazi." };
    }
    return {
      success: false,
      error: "Failed to create user",
    };
  }
}

// Dohvaćanje svih korisnika - CACHED
export async function getAllUsers(): Promise<User[]> {
  return unstable_cache(
    async () => {
      try {
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            accounts: true,
            sessions: true,
          },
        });

        return users.map((user) => ({
          ...user,
          hashedPassword: undefined, // Ne vraćajmo password
        })) as User[];
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    ["all-users"],
    {
      tags: [CACHE_TAGS.ALL_USERS],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje korisnika po ID-u - CACHED
export async function getUserById(id: string): Promise<User | null> {
  return unstable_cache(
    async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            accounts: true,
            sessions: true,
          },
        });

        if (!user) return null;

        return {
          ...user,
          hashedPassword: undefined, // Ne vraćajmo password
        } as User;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    [`user-${id}`],
    {
      tags: [CACHE_TAGS.USER_BY_ID(id)],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Dohvaćanje korisnika po email-u - CACHED
export async function getUserByEmail(email: string): Promise<User | null> {
  return unstable_cache(
    async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: true,
            sessions: true,
          },
        });

        if (!user) return null;

        return {
          ...user,
          hashedPassword: undefined, // Ne vraćajmo password
        } as User;
      } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
      }
    },
    [`user-email-${email}`],
    {
      tags: [CACHE_TAGS.USER_BY_EMAIL(email)],
      revalidate: 3600, // 1 hour
    }
  )();
}

// Ažuriranje korisnika
export async function updateUser(id: string, data: UpdateUserData) {
  try {
    const updateData: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      image: data.image,
    };

    // Hash novi password ako je poslan
    if (data.password) {
      updateData.hashedPassword = await hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_USERS);
    revalidateTag(CACHE_TAGS.USER_BY_ID(id));
    if (data.email) {
      revalidateTag(CACHE_TAGS.USER_BY_EMAIL(data.email));
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Email već postoji u bazi." };
    }
    return {
      success: false,
      error: "Failed to update user",
    };
  }
}

// Brisanje korisnika
export async function deleteUser(id: string) {
  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    await prisma.user.delete({
      where: { id },
    });

    // Invalidiranje cache-a
    revalidateTag(CACHE_TAGS.ALL_USERS);
    revalidateTag(CACHE_TAGS.USER_BY_ID(id));
    if (userToDelete?.email) {
      revalidateTag(CACHE_TAGS.USER_BY_EMAIL(userToDelete.email));
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Failed to delete user",
    };
  }
}

// Dobivanje statistika za admin - CACHED
export async function getUserStats() {
  return unstable_cache(
    async () => {
      try {
        const [total, withEmail, withoutEmail] = await Promise.all([
          prisma.user.count(),
          prisma.user.count({
            where: {
              emailVerified: { not: null },
            },
          }),
          prisma.user.count({
            where: {
              emailVerified: null,
            },
          }),
        ]);

        return {
          success: true,
          data: {
            total,
            withEmail,
            withoutEmail,
            verificationRate: total > 0 ? (withEmail / total) * 100 : 0,
          },
        };
      } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
          success: false,
          error: "Failed to fetch user statistics",
        };
      }
    },
    ["user-stats"],
    {
      tags: [CACHE_TAGS.ALL_USERS],
      revalidate: 1800, // 30 minutes for stats
    }
  )();
}

export async function hardCodeUsers() {
  try {
    const testUsers = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        password: "password123",
      },
      {
        name: "Admin User",
        email: "admin@msk.hr",
        password: "admin123",
      },
      {
        name: "Test User",
        email: "test@testcompany.com",
        password: "test123",
      },
    ];

    for (const userData of testUsers) {
      await createUser(userData);
    }

    console.log("Hard-coded users created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error creating hard-coded users:", error);
    return { success: false, error: "Failed to create hard-coded users" };
  }
}
