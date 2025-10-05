import { AUTH_COOKIE, SECRET_KEY } from "@/lib/config";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/models/User";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import "server-only";

type AdditionalContext = {
  Variables: {
    user: IUser;
  };
};

// 3. Create the Hono middleware
export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    // 1. Get the JWT from the cookie
    const token = getCookie(c, AUTH_COOKIE);

    if (!token) {
      // No token found
      return c.json({ error: "Unauthorized: No session token" }, 401);
    }

    try {
      // 2. Verify and decode the JWT
      // Use the secret from the environment/bindings

      const payload = await verify(token, SECRET_KEY);
      const userId = payload.userId as string;

      if (!userId) {
        return c.json({ error: "Unauthorized: Invalid token payload" }, 401);
      }

      // 3. Find the user in MongoDB
      // .select('+password') is NOT needed here as you only need profile data
      // .lean() is often used for performance when reading data
      await connectDB();
      const user = await User.findById(userId).lean();

      if (!user) {
        // Token is valid but user no longer exists
        return c.json({ error: "Unauthorized: User not found" }, 401);
      }

      // 4. Attach the user object to the context
      // The user object (IUser) is now available in subsequent handlers via c.get('user')
      c.set("user", user as unknown as IUser);

      // 5. Continue to the next handler
      await next();
    } catch (error) {
      console.error("MongoDB fetch failed:", error);
      // Catch token expiry, bad signature, or database errors
      return c.json({ error: "Unauthorized: Invalid or expired session" }, 401);
    }
  }
);
