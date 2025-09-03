import { Request, Response, Router } from "express";
import { fetchGoogleEvents } from "../services/googleCalendar";
import { decrypt } from "../utils/tokens";
import { Between } from "typeorm";
import dayjs from "../lib/dayjs";
import { requireAuth } from "../middlewares/requireAuth";
import { GoogleUser } from "../types/user";
import { decodeToken } from "../middlewares/decodeToken";
import { google } from "googleapis";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateRequest";
import { eventRepo, userRepo } from "../repositories";

const router = Router();

router.get(
  "/sync",
  requireAuth,
  decodeToken,
  async (req: Request, res: Response) => {
    try {
      const googleUser = req.user as GoogleUser;

      const user = await userRepo().findOneBy({ id: googleUser.id });
      if (!user) return res.status(404).json({ message: "User not found" });

      const accessToken = decrypt(user?.accessToken || "");
      const refreshToken = decrypt(user?.refreshToken || "");
      const googleEvents = await fetchGoogleEvents(accessToken, refreshToken);

      const activeEvents = googleEvents.filter(
        (event) => event.id && event.status !== "cancelled"
      );

      const mappedEvents = activeEvents.map((event) =>
        eventRepo().create({
          googleEventId: event.id!,
          name: event.summary || "Untitled",
          description: event.description || "",
          start: event.start?.dateTime || event.start?.date || "",
          end: event.end?.dateTime || event.end?.date || "",
          user,
        })
      );

      await eventRepo().upsert(mappedEvents, {
        conflictPaths: ["googleEventId"],
      });

      const googleIds = activeEvents.map((event) => event.id!);
      await eventRepo()
        .createQueryBuilder()
        .delete()
        .where("userId = :userId", { userId: user.id })
        .andWhere("googleEventId NOT IN (:...googleIds)", { googleIds })
        .execute();

      res.json({ message: "Events synced" });
    } catch (error) {
      res.status(500).json({ message: "Syncing events failed" });
    }
  }
);

router.get(
  "/:days",
  requireAuth,
  decodeToken,
  async (req: Request, res: Response) => {
    const googleUser = req.user as GoogleUser;

    const days = parseInt(req.params.days) || 7;

    const user = await userRepo().findOneBy({ id: googleUser.id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = dayjs();
    const endDate = startDate.add(days, "day");

    const events = await eventRepo().find({
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
  }
);

router.post(
  "/create",
  requireAuth,
  decodeToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const googleUser = req.user as GoogleUser;
      const { name, description, startTime, endTime } = req.body;

      const user = await userRepo().findOneBy({ id: googleUser.id });
      if (!user) return res.status(404).json({ message: "User not found" });

      const oauthClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oauthClient.setCredentials({
        access_token: decrypt(user.accessToken || ""),
        refresh_token: decrypt(user.refreshToken || ""),
      });

      const calendar = google.calendar({ version: "v3", auth: oauthClient });

      const event = {
        summary: name,
        description,
        start: {
          dateTime: startTime,
          timeZone: dayjs.tz.guess(),
        },
        end: {
          dateTime: endTime,
          timeZone: dayjs.tz.guess(),
        },
      };

      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      const createdEvent = response.data;

      await eventRepo().save({
        googleEventId: createdEvent.id!,
        name: createdEvent.summary || "Untitled",
        description: createdEvent.description || "",
        start: createdEvent.start?.dateTime || createdEvent.start?.date!,
        end: createdEvent.end?.dateTime || createdEvent.end?.date!,
        user,
      });

      return res.json({ message: "Event created", event: response.data });
    } catch (error) {
      res.status(500).json({ message: "Creating event failed" });
    }
  }
);

export default router;
