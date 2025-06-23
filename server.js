const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABO0r8KTba8ApsARRR5gZBb60GHBu07sdU46ifVBFqrHQha361lMPludRTZAZBH5ZBYRgdX1OreNxfLc3TTbu9zmmyEJuqTEVQBmT2zNDA2lqMG4A8i5KiUjNFDDUclNkit0DoEF6lB9lkTDJQ7TpyBcIz0M4IFTyyxEQ0U2b45zWYnx3gutvXi3XDpD6Dgicz3OmjcmX6FagRK0QsbQ8FclYqc1ZBSHLrQ4bcZD';

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
  const url = `https://graph.facebook.com/v19.0/me/messages`;

  const payload = {
    recipient: { id: instagramUserId },
    messaging_type: 'RESPONSE',
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