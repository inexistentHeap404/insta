const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'IGAAnA1BsDQvlBZAE1tUEQ3QjZAHTDB6Rm1iZAmJCVmNheFROQ0RFX3NXLU5vMFgxdDE0VGt1LWlpcTdsejU2cDUzcy1vbFlQaUpmWnRGSHpYeDlhMHRVYUdwSGE4SFpwRnQ1bG5FQk1CZAG10ZAlJIQ2hOTXJnWjM2SFVjUmFzNE9LOAZDZD';

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
    const comment = change?.value?.message;
    const commentId = change?.value?.comment_id;
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    if (comment?.toLowerCase().includes('send')) {
      await replyToComment(commentId, 'Here’s the link you asked for: https://yourlink.com');
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err.message);
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
