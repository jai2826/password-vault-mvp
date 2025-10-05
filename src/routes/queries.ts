// /src/lib/auth.ts or /src/lib/getCurrentUser.ts
"use server";

import { cookies } from "next/headers";
import { verify } from "hono/jwt";
import User, { IUser } from "@/models/User";
import { AUTH_COOKIE, SECRET_KEY } from "@/lib/config";

export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return null;
    }
    const payload = await verify(token, SECRET_KEY);
    const userId = payload.userId as string;

    if (!userId) {
      return null;
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return null;
    }

    return user as unknown as IUser;
  } catch (error) {
    console.error("Error fetching current user from MongoDB:", error);
    return null;
  }
};
