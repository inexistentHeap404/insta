const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = "EAAJZBKaZASHrABOyfhHv8g7LTZA8BLHDeWkgqkFySjn991dD2dbwReQKz80fSkrRUyHaXohG9oMz1WXmebdmbN7LBtFBHBLVrpT1ooHPQZCRo63gpUAJZBWszEypX9tDZAx7QjZCmuYJ7V2ZBa9C8eVVhbzBpqQpv2XjzgD725xIaP5KjGYJ2tIt0RqCvDATH7YZAzivWPRntUR05v1xI8lItLT5czteuXSXZCA82r4vBOVSgQHkAZD";

app.use(express.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const comment = change?.value?.text;
    const commentId = change?.value?.id;

    console.log('📩 New comment:', comment);

    if (comment?.toLowerCase().includes('send')) {
      await replyToComment(commentId, 'Here’s the link you asked for');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});


async function replyToComment(commentId, message) {
  await axios.post(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
    message
  }, {
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    }
  });
}

app.listen(PORT);
