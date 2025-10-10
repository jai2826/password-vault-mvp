import { Hono } from "hono";

import auth from "@/routes/auth/route";
import item from "@/routes/item/route";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/item", item);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
