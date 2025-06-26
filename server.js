const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'lol';
// THE BELOW PAGE ACCESS TOKEN IS VALID FOR 60 DAYS
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOzhG1KWyx6al3yVbZBsXiv4oEWKVtjrG5hR4T1txEAvhyRFeMxaxLvIjGikEavlBxXTq8cZB0WoDI8t0nSbUEWU2cs2Ppb9mXiIIzouNVr4y8xHhqqOxemUoqW6hh6rvNlwJZBL6Sx86CUewZAaL2jQSDj4vk6yuIZC0rE2v1anX0LQB6ZBhdtaZCBj';
const IG_USER_ID = '700137003181494';
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

/*app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  let lastCommentId;
  if (changes?.field === 'comments') {
    const comment = changes.value;
    const senderId = comment.from.id;
    const commentId = comment.id;
    try {
      try{
        await axios.post(
          `https://graph.facebook.com/v20.0/${comment.id}/replies`,
          {
            message: "Check your DM! 🚀"
          },
          {
            headers: {
              Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            }
          }
        );
      }
      catch(err){
        console.error(err.response?.data || err.message);
      }
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
});*/


let lastCommentId;

app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];

  if (changes?.field === 'comments') {
    const comment = changes.value;
    const senderId = comment.from.id;
    const commentId = comment.id;

    if (commentId === lastCommentId) return res.sendStatus(200);
    lastCommentId = commentId;

    try {
      try {
        await axios.post(
          `https://graph.facebook.com/v20.0/${comment.id}/replies`,
          {
            message: "Check your DM! 🚀"
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
