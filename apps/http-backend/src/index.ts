import express from "express";
import "dotenv/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  JoinRoomSchema,
  SigninSchema,
} from "@repo/common/types";
import {
  db,
  users,
  eq,
  rooms,
  desc,
  canvasSnapshots,
  roomMembers,
  and,
} from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log("Validation failed:", parsedData.error);
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const [user] = await db
      .insert(users)
      .values({
        email: parsedData.data.email,
        password: hashedPassword,
        name: parsedData.data.username,
      })
      .returning({ id: users.id });

    if (!user) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    res.json({ userId: user.id });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(411).json({ message: "User already exists with the email" });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, parsedData.data.email),
  });

  if (!user) {
    return res.status(403).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password,
  );

  if (!isPasswordValid) {
    return res.status(403).json({
      message: "Invalid password",
    });
  }

  const jwtToken = jwt.sign(
    {
      userId: user.id,
      name: user.name,
    },
    JWT_SECRET,
  );

  res.json({
    token: jwtToken,
  });
});

app.get("/room/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const data = await db.query.canvasSnapshots.findMany({
    where: eq(canvasSnapshots.roomId, roomId),
    orderBy: desc(canvasSnapshots.id),
  });

  if (!data) {
    return res.status(404).json({
      message: "No data found",
    });
  }

  res.json({
    data,
  });
});

app.post("/createRoom", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
    });
  }

  //@ts-ignore
  const userId = req.userId;

  try {
    const existingRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.slug, parsedData.data.name))
      .limit(1);

    if (existingRooms.length > 0) {
      return res.status(409).json({
        message:
          "Room already exists with this name. Please choose a different name.",
      });
    }
    const [newRoom] = await db
      .insert(rooms)
      .values({
        slug: parsedData.data.name,
        adminId: userId,
      })
      .returning({ id: rooms.id });

    if (!newRoom) {
      return res.status(500).json({
        message: "Failed to retrieve the new room ID from the database.",
      });
    }

    return res.json({
      roomId: newRoom.id,
    });
  } catch (e) {
    console.error("Room creation error:", e);
    return res.status(500).json({
      message: "Failed to create room due to an internal server error.",
    });
  }
});

app.post("/joinRoom", middleware, async (req, res) => {
  const parsedData = JoinRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ message: "Incorrect inputs" });
  }

  const roomId = Number(parsedData.data.roomId);
  //@ts-ignore
  const userId = req.userId;

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const existing = await db.query.roomMembers.findFirst({
    where: and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
  });

  if (!existing) {
    await db.insert(roomMembers).values({
      roomId,
      userId,
    });
  }

  res.json({
    roomId: room.id,
    message: "Room joined",
  });
});

app.get("/canvas/:roomId", middleware, async (req, res) => {
  const roomId = Number(req.params.roomId);

  if (isNaN(roomId)) {
    return res.status(400).json({ message: "Invalid roomId" });
  }

  //@ts-ignore
  const userId = req.userId;

  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isMember = await db.query.roomMembers.findFirst({
    where: and(eq(roomMembers.roomId, roomId), eq(roomMembers.userId, userId)),
  });

  if (room.adminId !== userId && !isMember) {
    return res.status(403).json({ message: "Access denied. You are not a member of this room." });
  }

  const snapshot = await db.query.canvasSnapshots.findFirst({
    where: eq(canvasSnapshots.roomId, roomId),
  });

  if (!snapshot) {
    return res.json({ elements: [] });
  }

  res.json({
    elements: (snapshot.data as any).elements ?? [],
  });
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
