const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABPP3wicNWomOvoWA3akqhRhBYyHRS4g5GMqkgAlR1qIHKdT1V7eUY58ZCZCn0xzHL6KUEo8b8d1tWigbnWy98gMLLI02ZBktG1M5jHx7WsMyyXBZCc2XzODn9MtWeGRA2VTRDU7ROoxxDTHkcOWxSxJJkqZCfUnZCA35Xwfeke2csIMQ9pbd6GMzbjVR1E9ndRJh3uqu5ZA62i0W09Wwu8fjLyza3umKE2sZD';
const IG_USER_ID = '700137003181494';

let handledCommentIds = [];

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
    const commentId = comment.id;
    const commentText = comment.text?.toLowerCase() || '';

    if (handledCommentIds.includes(commentId)) return res.sendStatus(200);
    if (!commentText.includes("send")) return res.sendStatus(200);    
    handledCommentIds.push(commentId);
    
    try {
      try {
        await axios.post(
          `https://graph.facebook.com/v20.0/${commentId}/replies`,
          { message: "Check your DM! 🚀" },
          {
            headers: {
              Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (err) {}

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
