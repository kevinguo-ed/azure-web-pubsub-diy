const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const hubname = "reactChat";
const service = new WebPubSubServiceClient(process.env.ConnectionString, hubname);

const port = 8088;
const app = express();

app.use(express.static("build"));
app.get('/negotiate', async (req, res) => {
    const token = await service.getClientAccessToken({roles: [
        "webpubsub.sendToGroup.chat",
        "webpubsub.joinLeaveGroup.chat"
    ]});
    res.status(200).send(token.url);
})
app.listen(port, ()=>console.log(`Open http://localhost:${port}`));