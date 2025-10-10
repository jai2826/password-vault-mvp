import connectDB from "@/lib/connectDB";
import { sessionMiddleware } from "@/lib/session-middleware";
import { encryptData } from "@/lib/utils";
import Item, { IItem } from "@/models/Item";
import { createItemSchema, updateItemSchema } from "@/routes/item/schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  // Get all items for the logged-in user
  .get("/allItems", sessionMiddleware, async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }

    try {
      await connectDB();
      const items = await Item.find({ user: user._id }).sort({ createdAt: -1 });
      return c.json({ data: items });
    } catch (error) {
      console.error("Error fetching items:", error);
      return c.json({ message: "Something went wrong." }, { status: 500 });
    }
  })
  // Get item by ID
  .get("/:itemId", sessionMiddleware, async (c) => {
    try {
      await connectDB();
      const user = c.get("user");
      const itemId = c.req.param("itemId");

      // 1. Find the item by ID
      const item = await Item.findOne({ _id: itemId, user: user._id });
      if (!item) {
        return c.json({ message: "Item not found" }, { status: 404 });
      }

      return c.json({ data: item });
    } catch (error) {
      console.error("Error fetching item:", error);
      return c.json({ message: "Something went wrong." }, { status: 500 });
    }
  })
  // Create a new item
  .post(
    "/createItem",
    sessionMiddleware,
    zValidator("json", createItemSchema),
    async (c) => {
      const { title, email, password, url, notes } = c.req.valid("json");
      const user = c.get("user");
      try {
        await connectDB();

        if (!user) {
          return c.json({ message: "Not logged in" }, { status: 401 });
        }
        if (!title || !email || !password) {
          return c.json(
            { message: "Missing title, email or password" },
            { status: 400 }
          );
        }

        // 3. Create and save the new user
        const newItem = new Item({
          user: user._id,
          title,
          email,
          password: encryptData(password),
          url,
          notes,
        });
        await newItem.save();

        return c.json(
          { message: "Item created successfully" },
          { status: 201 }
        );
      } catch (error) {
        console.error("Item creation error:", error);
        return c.json({ message: "Something went wrong." }, { status: 500 });
      }
    }
  )
  // Update an existing item
  .patch(
    "/:itemId",
    sessionMiddleware,
    zValidator("json", updateItemSchema.partial()),
    async (c) => {
      console.log("New FOUND HERE");
      const user = c.get("user");
      const itemId = c.req.param("itemId");
      const { title, email, password, url, notes } = c.req.valid("json");
      if (!user) {
        return c.json(
          { success: false, message: "Not logged in" },
          { status: 401 }
        );
      }

      try {
        await connectDB();

        const item = await Item.findById(itemId);
        if (!item) {
          return c.json({ message: "Item not found" }, { status: 404 });
        }
        const encryptedData = encryptData(password!) || null;
        const updatedItem = await Item.findOneAndUpdate(
          { _id: itemId, user: user._id },
          { title, email, password: encryptedData, url, notes },
          { new: true }
        );
        if (!updatedItem || updatedItem === item) {
          return c.json({ message: "Something went wrong" }, { status: 404 });
        }
        return c.json({
          message: "Item updated successfully",
          data: updatedItem as IItem,
        });
      } catch (error) {
        console.error("Item update error:", error);
        return c.json({ message: "Something went wrong." }, { status: 500 });
      }
    }
  )
  // Delete an item
  .delete("/:itemId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json(
        { success: false, message: "Not logged in" },
        { status: 401 }
      );
    }
    const itemId = c.req.param("itemId");

    try {
      await connectDB();

      const item = await Item.findById(itemId);
      if (!item) {
        return c.json({ message: "Item not found" }, { status: 404 });
      }
      const deletedItem = await Item.findOneAndDelete({
        _id: itemId,
        user: user._id,
      });

      return c.json({
        message: "Item deleted successfully",
        data: deletedItem,
      });
    } catch (error) {
      console.error("Item delete error:", error);
      return c.json({ message: "Something went wrong." }, { status: 500 });
    }
  });

export default app;
