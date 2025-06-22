const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = "EAAJZBKaZASHrABOZBZCZClIpmFL992fZARiWrEW974jjyfIKQPqZA5jhObdFgVJgAPmhoKczmKi2YsbZAx9SP1rU6WdpJJb3yayRXlK2HHAoBG8aZCVojAFeFRCaZAYZBYyWE1WSZAjULf3JZBqJOu8WIT7inQHyzSSBuNRUcmI3XkLcd24doobO3IF7mUtDOBbOSXcNWsDfCxZAeZCEvYKnPwZBomKTmuTcNxoFKOnoCc9Y2tZBxVWiMyQZDZD";

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
      await sendDM(commentId, 'Here’s the link you asked for');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});

async function sendDM(userId, message) {
  const url = `https://graph.facebook.com/v19.0/${userId}/messages`;

  await axios.post(
    url,
    {
      messaging_type: 'RESPONSE',
      recipient: { id: userId },
      message: { text: message }
    },
    {
      headers: {
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
      }
    }
  );
}


app.listen(PORT);
