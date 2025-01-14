const db = require("../models/db");
const { BAD_REQUEST } = require("../middlewares/customErrors");
const { findNotification, createNotification } = require("../models/webhook");
const handleWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    if (!event || !data) {
      throw new Error("Missing event or data in webhook payload.");
    }

    if (event === "transfer") {
      const { reference } = data;

      // Validate required fields
      const missingFields = [
        "user_id",
        "narration",
        "amount",
        "reference",
        "status",
        "recipient_bank",
        "recipient_account",
      ].filter((field) => !data[field]);

      if (missingFields.length > 0) {
        throw new BAD_REQUEST(
          `Missing required fields in webhook payload: ${missingFields.join(
            ", "
          )}`
        );
      }

      // Check for existing notification
      const existingNotification = await findNotification(reference);
      if (existingNotification) {
        return res
          .status(409)
          .json({ message: "Notification already exists." });
      }

      // Create a new notification
      await createNotification({
        event,
        ...data,
      });
    } else {
      // Handle other event types (if needed)
      await createNotification({
        event,
        ...data,
      });
    }

    // Respond with a success message
    res.status(201).json({ message: "Webhook processed successfully." });
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { handleWebhook };
