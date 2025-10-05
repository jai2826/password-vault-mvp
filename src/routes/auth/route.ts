import { AUTH_COOKIE, SECRET_KEY } from "@/lib/config";
import connectDB from "@/lib/connectDB";
import { sessionMiddleware } from "@/lib/session-middleware";
import { decryptData, encryptData } from "@/lib/utils";
import User, { IUser } from "@/models/User";
import { loginSchema, registerSchema } from "@/routes/schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";



const app = new Hono()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    console.log("route", c.req.valid("json"));
    const { name, email, password } = c.req.valid("json");

    try {
      await connectDB();

      if (!name || !email || !password) {
        return c.json(
          { message: "Missing name, email or password" },
          { status: 400 }
        );
      }

      // 1. Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return c.json({ message: "User already exists" }, { status: 409 });
      }

      // 2. Hash the Master Password securely with crypto-js
      const hashedPassword = encryptData(password);

      // 3. Create and save the new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      const payload = {
        userId: newUser._id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
      };
      const token = await sign(payload, SECRET_KEY);

      setCookie(c, AUTH_COOKIE, token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return c.json(
        { message: "User registered successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Registration error:", error);
      return c.json({ message: "Something went wrong." }, { status: 500 });
    }
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      await connectDB();

      const { email, password } = c.req.valid("json");
      // 1. Check if user already exists
      const existingUser = await User.findOne<IUser>({ email });
      if (!existingUser) {
        return c.json({ message: "User does not exist" }, { status: 404 });
      }
      const decryptedPassword = decryptData(existingUser.password);

      if (decryptedPassword !== password) {
        return c.json({ message: "Invalid password" }, { status: 401 });
      } else {
        const payload = {
          userId: existingUser._id,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expires in 24 hours
        };
        const token = await sign(payload, SECRET_KEY);

        setCookie(c, AUTH_COOKIE, token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return c.json({ message: "Logged in successfully", success: true });
      }
    } catch (error) {
      console.error("Login Error:", error);
      return c.json({ message: "Login Error" }, { status: 500 });
    }
  })
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }
    deleteCookie(c, AUTH_COOKIE, {
      path: "/",
      // The domain and secure options should match exactly how the cookie was set during login
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // 2. Return a success response
    return c.json({ success: true, message: "Logged out successfully" });
  });

export default app;
