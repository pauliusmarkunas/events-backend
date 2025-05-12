import pool from "../utils/pgConnection.js";

export const getEventsStats = async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT  
    (SELECT COUNT(*) FROM events WHERE deleted_at IS NULL) AS total_events,
    (SELECT COUNT(*) FROM events WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL) AS events_created_last_week,
    (SELECT COUNT(*) FROM guests WHERE deleted_at IS NULL) AS total_guests,
    (SELECT COUNT(*) FROM guests WHERE registered_at >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL) AS guests_registered_last_week;
    `);

    res.status(200).json({
      message: "Event statistics retrieved successfully",
      stats: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching event statistics:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrganizersStats = async (req, res) => {
  try {
    const result = await pool.query(`
     SELECT 
    (SELECT COUNT(*) FROM organizers WHERE deleted_at IS NULL) AS total_organizers,
    (SELECT COUNT(*) FROM organizers WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND deleted_at IS NULL) AS organizers_added_last_week;
    `);

    res.status(200).json({
      message: "Organizer statistics retrieved successfully",
      stats: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching organizer statistics:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
