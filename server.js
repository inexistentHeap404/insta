const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOwx4bUZAmTebw2AfLrOZAHhQGAph4CXMplugTb854eljIf4tdE9TiodJkEH2LJtHlzBTQrkFNWUnUQGRkUf0j0LtQczmJ2Y1XHgr44ZCX7j0wAjZCdChM2kFtbGZCWcu9p3I7t8ZBRjWZBZB0eaifN7kDZBdOq2EJFJ5V3AhF1BMJN0TVPuCZBfeF3zcZCTZBS7xXkQE15M4jZBtIPkAxhamF9ttJCOEcfmtsQwZDZD';
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
        `https://graph.facebook.com/v20.0/${IG_USER_ID}/messages`,
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
