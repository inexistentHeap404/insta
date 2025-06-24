const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOzt1BHg8JZBZByyxZBTZAsJ8tn1D9gsrpPmGJZAgN83ZB9Jzin39JGoZB4oF6ipplSEIfo8Ssi0Ti4ftPq0rlysZBVRG6XrFfVX3oNKYSws3Sb6gtiJU2DfSVJ22crWCm6QrsZAmdHo90r7GVqFGnnhHJixgMSKL0NJCsUcOYEGjUycoihf5ySxUqu5FT7JGtKhuG6TBnM71hc3XczYjHdBRogR3s6GYZD';
const IG_USER_ID = '17841475042746798';
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];

  if (changes?.field === 'comments') {
    const comment = changes.value;
    const senderId = comment.from.id;

    try {
      await axios.post(
        `https://graph.facebook.com/v23.0/${IG_USER_ID}/messages`,
        {
          recipient: { id: senderId },
          message: { text: "Thanks for commenting!" }
        },
        {
          headers: {
            Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
