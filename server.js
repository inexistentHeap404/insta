const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABPLuV7VumAQds6OZAcbWZB8iUsU05AnXTpVGdl0VlytATWnAqrk39g8IcHmv7HDoLz1jvLxsQdVZC46J14NKsjKTvIN3u2hgiasR5M5khvPy61zdX9DRsP3AV8UutVgwpGdZA63ZA7IOXoTOWO6WFLdIjmHzojZAwIV0XgWt5c3IZAXlgblaz2eOrWDbPkzbiOW9C0y4W7eUOlenR45mpPeK52BFUpszjNIZD';
const IG_USER_ID = '700137003181494';
const IG_PAGE_ID = '17841475042746798'
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

// ✅ GET Instagram feed thumbnails
app.get('/insta-feed', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v20.0/${IG_PAGE_ID}/media`,
      {
        params: {
          fields: 'id,media_type,media_url,thumbnail_url,caption,permalink',
          access_token: PAGE_ACCESS_TOKEN
        }
      }
    );

    const thumbnails = data.data.map(post => ({
      id: post.id,
      media_type: post.media_type,
      thumbnail: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      caption: post.caption || ''
    }));

    res.json(thumbnails);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Failed to fetch IG feed');
  }
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
