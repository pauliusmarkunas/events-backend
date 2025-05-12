import pool from "../utils/pgConnection.js";

export async function addEvent(req, res) {
  const { title, description, eventDate } = req.body;

  const organizerId = req.user.id;

  try {
    const result = await pool.query(
      "insert into events (title, description, event_date, organizer_id) values ($1, $2, $3, $4) returning id, title, description, event_date, created_at",
      [title, description, eventDate, organizerId]
    );

    if (result.rowCount > 0) {
      return res.status(200).json({
        message: "Event created successfully",
        event: result.rows[0],
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error`, error: error.message });
  }
}

export async function getOrganizersEvents(req, res) {
  const organizerId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT id, title, description, event_date, created_at FROM events WHERE organizer_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC",
      [organizerId]
    );

    if (result.rowCount > 0) {
      return res.status(200).json({
        events: result.rows,
      });
    } else {
      return res.status(200).json({
        message: "No events created yet",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal Server Error`, error: error.message });
  }
}

export async function updateEvent(req, res) {
  const organizerId = req.user.id;
  const eventId = req.params.id;
  const { title, description, eventDate } = req.body;

  try {
    // Optional: Check if event exists and belongs to organizer
    const existing = await pool.query(
      "SELECT id FROM events WHERE id = $1 AND organizer_id = $2 AND deleted_at IS NULL",
      [eventId, organizerId]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update the event
    const result = await pool.query(
      `UPDATE events 
         SET title = $1, description = $2, event_date = $3 
         WHERE id = $4 AND organizer_id = $5 
         RETURNING id, title, description, event_date, created_at`,
      [title, description, eventDate, eventId, organizerId]
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: result.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

export async function deleteEvent(req, res) {
  const organizerId = req.user.id;
  const eventId = req.params.id;

  try {
    // Check if event exists and is not already deleted
    const existing = await pool.query(
      "SELECT id FROM events WHERE id = $1 AND organizer_id = $2 AND deleted_at IS NULL",
      [eventId, organizerId]
    );

    if (existing.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Event not found or already deleted." });
    }

    // Soft delete the event by setting deleted_at
    await pool.query(
      "UPDATE events SET deleted_at = NOW() WHERE id = $1 AND organizer_id = $2",
      [eventId, organizerId]
    );

    res
      .status(200)
      .json({ message: "Event deleted successfully (soft delete)." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
