const express = require('express');
const bodyParser = require('body-parser');
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
  if (mode && token === VERIFY_TOKEN) res.status(200).send(challenge);
  else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const comment = change?.value?.message;
  const username = change?.value?.from?.username;
  if (comment?.toLowerCase().includes('send')) {
    const userId = await getUserIdFromUsername(username);
    await sendDM(userId, 'Hey! Here’s the thing you asked for.');
  }
  res.sendStatus(200);
});

async function getUserIdFromUsername(username) {
  const res = await axios.get(`https://graph.facebook.com/v19.0/ig_username?username=${username}&access_token=${PAGE_ACCESS_TOKEN}`);
  return res.data.id;
}

async function sendDM(userId, message) {
  await axios.post(`https://graph.facebook.com/v19.0/${userId}/messages`, {
    messaging_type: 'RESPONSE',
    recipient: { id: userId },
    message: { text: message }
  }, {
    headers: { Authorization: `Bearer ${PAGE_ACCESS_TOKEN}` }
  });
}

app.listen(PORT);
