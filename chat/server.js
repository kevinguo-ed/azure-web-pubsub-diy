const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express();
const hubName = 'chat';
const port = 8080;

let serviceClient = new WebPubSubServiceClient(process.env.ConnectionString, hubName);

app.use(handler.getMiddleware());
app.get('/negotiate', async (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.status(400).send('missing user id');
    return;
  }
  let token = await serviceClient.getClientAccessToken({ userId: id });
  res.json({
    url: token.url
  });
});

app.use(express.static('public'));
app.listen(port, () => console.log(`Event handler listening at http://localhost:${port}${handler.path}`));
