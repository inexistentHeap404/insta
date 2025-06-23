/*const express = require('express');
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
*/


const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const VERIFY_TOKEN = 'lol';
const PAGE_ACCESS_TOKEN = 'EAAJZBKaZASHrABOxDX8aUEloLucOL87Pm5GHvlLvgnAT11k76p1EvHfpemZCZAjWXIcvGNs6XGKW4e7o63QrEkXiBQQFHdZCefVyzO27lnF0jYoaPjZCstOiS2cX1zFEIWnrxx11lZBoMA3tQjdSHym9PkW9d1M6lCBm2ZAkTIMky8wVGjOXLVe26I4cGbdkp6mVokw7dMtTwZAWieZAAleOz4EY9nIU3EmHZBoOoYOiIgMk9XBBQZDZD';

app.use(express.json());

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Webhook received:', JSON.stringify(req.body, null, 2));
    
    const entry = req.body.entry?.[0];
    
    if (entry?.changes) {
      for (const change of entry.changes) {
        if (change.field === 'comments' && change.value) {
          const comment = change.value;
          const commentText = comment.text;
          const commenterId = comment.from?.id;
          const mediaId = comment.media?.id;
          
          console.log('💬 Comment received:', commentText);
          console.log('👤 From user:', commenterId);
          
          if (commentText?.toLowerCase().includes('send') && commenterId) {
            await sendInstagramDM(commenterId, '📦 Here\'s the link you asked for: https://yourlink.com');
          }
        }
      }
    }
    
    if (entry?.messaging) {
      for (const messagingEvent of entry.messaging) {
        const senderId = messagingEvent.sender?.id;
        const messageText = messagingEvent.message?.text;
        
        if (messageText && senderId) {
          console.log('📩 DM received:', messageText);
        }
      }
    }
    
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook error:', err.response?.data || err.message);
    res.sendStatus(500);
  }
});

async function sendInstagramDM(instagramUserId, message) {
  try {
    const userInfoUrl = `https://graph.facebook.com/v19.0/${instagramUserId}?fields=id&access_token=${PAGE_ACCESS_TOKEN}`;
    
    const url = `https://graph.facebook.com/v19.0/me/messages`;
    
    const payload = {
      recipient: {
        id: instagramUserId
      },
      message: {
        text: message
      }
    };
    
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Sent Instagram DM to ${instagramUserId}`);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error sending Instagram DM:', error.response?.data || error.message);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});