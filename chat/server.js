const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express();
const hubName = 'demochat';
const port = 8080;

let serviceClient = new WebPubSubServiceClient(process.env.ConnectionString, hubName);

app.get('/negotiate', async (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.status(400).send('missing user id');
    return;
  }
  let token = await serviceClient.getClientAccessToken(
    { userId: id, 
      roles: [ 
        "webpubsub.joinLeaveGroup.chatgroup",
        "webpubsub.sendToGroup.chatgroup"] });
  res.json({
    url: token.url
  });
});

app.use(express.static('public'));
app.listen(port, () => console.log(`Open http://localhost:${port}/index.html`));
