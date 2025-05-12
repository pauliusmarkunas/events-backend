import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  addGuest,
  deleteGuest,
  getEventGuests,
  updateGuest,
} from "../controllers/guestController.js";
import guestValidation from "../middlewares/bodyValidations/guest/guestValidation.js";

const router = express.Router();
router.use(authUser);

// event id
router.get("/all/:id", getEventGuests);

router.post("/", guestValidation, addGuest);

router.put("/update/:id", guestValidation, updateGuest);

router.put("/delete/:id", deleteGuest);

export default router;
