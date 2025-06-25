const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOzZBhR95cHbvUAhwAtVJSalhrsRtE6netZCCCLB4d2UJXCvYKPjehyEaBpOKRI63zSeTTrcfmuK8BwU15EnVSac7CW2mWaJ1zcqoj8G5ZA62kNu4jVcliRoMnUmwDx9KNedYR8MBLCOolEA08KaZAhZAgYnBVTnu97HCRIIAU4IiDR6pmsw2JgpuXYtk3h3pWDsZB2AZBSg8C6tWLS14GMClVTTGonBXV4ZD';
const IG_USER_ID = '700137003181494';
//700137003181494
//17841475042746798
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
    await axios.post(
      `https://graph.facebook.com/v20.0/${comment.comment_id}/replies`,
      {
        message: "Check your DM!!!"
      },
      {
        headers: {
          Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

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
