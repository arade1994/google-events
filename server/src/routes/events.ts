import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { fetchGoogleEvents } from "../services/googleCalendar";
import { Event } from "../entities/Event";
import jwt from "jsonwebtoken";
import { decrypt } from "../utils/tokens";
import { Between } from "typeorm";
import dayjs from "dayjs";

const router = Router();

router.get("/sync", async (req: Request, res: Response) => {
  try {
    let decodedJwt: any;
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Not logged in" });

    try {
      decodedJwt = jwt.verify(token, process.env.JWT_SECRET || "");
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const eventRepo = AppDataSource.getRepository(Event);

    const user = await userRepo.findOneBy({ id: decodedJwt?.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = decrypt(user?.accessToken || "");
    const refreshToken = decrypt(user?.refreshToken || "");

    const googleEvents = await fetchGoogleEvents(accessToken, refreshToken);

    const googleEventIds = new Set<string>();

    for (const event of googleEvents) {
      if (!event.id) continue;
      googleEventIds.add(event.id);

      if (event.status === "cancelled") {
        await eventRepo.delete({ googleEventId: event.id });
        continue;
      }

      const existing = await eventRepo.findOneBy({ googleEventId: event.id });
      if (!existing) {
        const newEvent = eventRepo.create({
          googleEventId: event.id,
          name: event.summary || "",
          description: event.description || "",
          start: event.start?.dateTime || event.start?.date || "",
          end: event.end?.dateTime || event.end?.date || "",
          user,
        });
        await eventRepo.save(newEvent);
      }

      const dbEvents = await eventRepo.find({
        where: { user: { id: user.id } },
      });
      for (const dbEvent of dbEvents) {
        if (!googleEventIds.has(dbEvent.googleEventId)) {
          await eventRepo.remove(dbEvent);
        }
      }
    }

    res.json({ message: "Events synced" });
  } catch (error) {
    res.status(500).json({ message: "Syncing events failed" });
  }
});

router.get("/:filterDays", async (req: Request, res: Response) => {
  const filterDays = parseInt(req.params.filterDays) || 7;
  const userRepo = AppDataSource.getRepository(User);
  const eventRepo = AppDataSource.getRepository(Event);

  let decodedJwt: any;
  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    decodedJwt = jwt.verify(token, process.env.JWT_SECRET || "");
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }

  const user = await userRepo.findOneBy({ id: decodedJwt?.id });
  if (!user) return res.status(404).json({ message: "User not found" });

  const startDate = dayjs();
  const endDate = startDate.add(filterDays, "day");

  const events = await eventRepo.find({
    where: {
      user,
      start: Between(
        startDate.format("YYYY-MM-DDTHH:mm:ss"),
        endDate.format("YYYY-MM-DDTHH:mm:ss")
      ),
    },
    order: { start: "ASC" },
  });
  res.json(events);
});

export default router;
