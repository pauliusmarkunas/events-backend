import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  addEvent,
  deleteEvent,
  getOrganizersEvents,
  updateEvent,
} from "../controllers/eventController.js";
import eventValidation from "../middlewares/bodyValidations/event/eventValidation.js";

const router = express.Router();

router.use(authUser);

router.post("/", eventValidation, addEvent);

router.get("/all", getOrganizersEvents);

router.put("/update/:id", eventValidation, updateEvent);

router.put("/delete/:id", deleteEvent);

export default router;
