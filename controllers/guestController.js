import pool from "../utils/pgConnection.js";

export const getEventGuests = async (req, res) => {
  const { id } = req.params;

  try {
    // Query to fetch all guests for the given event ID
    const result = await pool.query(
      "SELECT * FROM guests WHERE event_id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No guests found for this event" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching event guests:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const addGuest = async (req, res) => {
  const { eventId, fullName, email, age, birthYear } = req.body;

  try {
    const checkForEvent = await pool.query(
      "SELECT * FROM events WHERE id = $1 AND deleted_at IS NULL",
      [eventId]
    );

    if (checkForEvent.rowCount === 0) {
      return res.status(404).json({
        message:
          "Event for which you are trying to add guest is deleted or not found",
      });
    }

    // Calculate birthYear if not provided
    const calculatedBirthYear = birthYear || new Date().getFullYear() - age;

    // Insert the new guest into the database
    const result = await pool.query(
      "INSERT INTO guests (event_id, full_name, email, age, birth_year) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [eventId, fullName, email, age, calculatedBirthYear]
    );

    if (result.rowCount < 1) {
      return res.status(400).json({ message: "Failed to add guest" });
    }

    res.status(201).json({
      message: "Guest added successfully",
      guest: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding guest:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateGuest = async (req, res) => {
  const { id } = req.params; 
  const { fullName, email, age, birthYear } = req.body;

  try {
    // Check if the guest exists
    const checkGuest = await pool.query(
      "SELECT * FROM guests WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (checkGuest.rowCount === 0) {
      return res.status(404).json({ message: "Guest not found or deleted" });
    }

    // Calculate birthYear if not provided
    const calculatedBirthYear =
      birthYear || (age ? new Date().getFullYear() - age : null);

    // Update the guest in the database
    const result = await pool.query(
      `UPDATE guests 
       SET full_name = COALESCE($1, full_name), 
           email = COALESCE($2, email), 
           age = COALESCE($3, age), 
           birth_year = COALESCE($4, birth_year) 
       WHERE id = $5 
       RETURNING *`,
      [fullName, email, age, calculatedBirthYear, id]
    );

    if (result.rowCount < 1) {
      return res.status(400).json({ message: "Failed to update guest" });
    }

    res.status(200).json({
      message: "Guest updated successfully",
      guest: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating guest:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteGuest = async (req, res) => {
  const { id } = req.params; 

  try {
    // Check if the guest exists
    const checkGuest = await pool.query(
      "SELECT * FROM guests WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (checkGuest.rowCount === 0) {
      return res.status(404).json({ message: "Guest not found or already deleted" });
    }

    // Perform a soft delete by setting the deleted_at column
    const result = await pool.query(
      "UPDATE guests SET deleted_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount < 1) {
      return res.status(400).json({ message: "Failed to delete guest" });
    }

    res.status(200).json({
      message: "Guest deleted successfully",
      guest: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting guest:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
