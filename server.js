const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'IGAAnA1BsDQvlBZAE80azM3MG5CbFMxWUZALVVR1cjcybkFLTUVKZAUx6MXljekR2RzM1aG1HUXB6RlctMzU4V1ZA5dE8wbVlDEAAJZBKaZASHrABO6DUz5KTWsfI5gAyr86wOdO55rMxVlH1CcOtXCTQBXv07J3wtjr2BNHZCZCh07pYbq4Sm3HDMUl6yg6gaE5fd8wCXrE5tZAV1giBPPaQheXRD46Xqz5ZAn8lExhhLqyRyZBPcxsC9ZA8nllHjVL6nl4qgyWnbOiAZC8eYm3wGddGuhyN3lu3qsUw6VwrxugiRxNJPSzZCT0qJn0KMkDmYaWc8VWPdVZBGTlhwQ01jOGY2aThWaVprX3o3U0lTZAnl3bjN1MHczcUFUVjR4XzJxZADJXNnJqNi1haGRQQUVWM1ZA0SQZDZD';
/*
IGAAnA1BsDQvlBZAFBfQnNyWml5SGlNWFpjVTNmU0w2M1FxRzNoWkhkNXN0eEdZAVlR4bEx1ZADdXeU9JLTR3eTRFOVN0aTBpX201dHF5d1VLTmJoMjBDWjZArMXZApbVNxQWpPS1pzVTJSYkcwbmowejU0OXF6LXhRMjl4YU5VN0ZApUQZDZD

*/
app.use(express.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const commentText = change?.value?.text;
    const senderId = change?.value?.from?.id;

    console.log('📨 Incoming comment:', commentText);

    if (commentText?.toLowerCase().includes('send') && senderId) {
      await sendDM(senderId, '📦 Here’s the link you asked for: https://yourlink.com');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});

async function sendDM(instagramUserId, message) {
const url = `https://graph.instagram.com/v23.0/${instagramUserId}/messages`;

  const payload = {
    recipient: { id: instagramUserId },
    message: { text: message }
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    }
  });

  console.log(`✅ Sent DM to ${instagramUserId}`);
}

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});