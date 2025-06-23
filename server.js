const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOxDX8aUEloLucOL87Pm5GHvlLvgnAT11k76p1EvHfpemZCZAjWXIcvGNs6XGKW4e7o63QrEkXiBQQFHdZCefVyzO27lnF0jYoaPjZCstOiS2cX1zFEIWnrxx11lZBoMA3tQjdSHym9PkW9d1M6lCBm2ZAkTIMky8wVGjOXLVe26I4cGbdkp6mVokw7dMtTwZAWieZAAleOz4EY9nIU3EmHZBoOoYOiIgMk9XBBQZDZD';
//IGAAnA1BsDQvlBZAE5zai1fYklsbFg3aFdydWUzOS00THpmZA3FNREtzY3lTa29STFdrLWFyOTZAlM1hyMUthX1ppV3dWM3E2Vm8tUHFZAMHV4R1M1WWFEbmNmbkdkRUx6SFRfVE1yR0F5M3FobTFwSFdWUjR1OUZARQ20za19oMm1MbwZDZD
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
const url = `https://graph.facebook.com/v19.0/${instagramUserId}/messages`;

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