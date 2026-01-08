const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PAGE_TOKEN = process.env.PAGE_TOKEN || "TEST_TOKEN";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "test123";

// Route اختبار
app.get("/", (req, res) => {
  res.send("Facebook Bot is running ✅");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// استقبال الرسائل
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const event = entry?.messaging?.[0];

  if (event?.message?.text) {
    const senderId = event.sender.id;
    const text = event.message.text;

    await sendMessage(senderId, `أهلاً 👋 وصلني: ${text}`);
  }

  res.sendStatus(200);
});

async function sendMessage(id, text) {
  await axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_TOKEN}`,
    {
      recipient: { id },
      message: { text }
    }
  );
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
