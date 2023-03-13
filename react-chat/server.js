const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const hubname = "reactChat";
const service = new WebPubSubServiceClient(process.env.ConnectionString, hubname);

const port = 8088;
const app = express();

app.use(express.static("build"));
app.get('/negotiate', async (req, res) => {
    let user = req.query.id;
    if (!user){
        res.status(400).send('missing user id');
        return;
    }
    const token = await service.getClientAccessToken({userId: user, roles: [
        "webpubsub.sendToGroup.chat",
        "webpubsub.joinLeaveGroup.chat"
    ]});
    res.json({
        url: token.url
    });
})
app.listen(port, ()=>console.log(`Open http://localhost:${port}`));