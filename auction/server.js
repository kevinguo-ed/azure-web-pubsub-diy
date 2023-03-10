const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
const app = express();

const port = 8888;
let currentBid = 18000;
app.use(express.static('public'));
app.listen(port, () => console.log(`Open http://localhost:${port}/index.html`));
let serviceClient = new WebPubSubServiceClient(process.env.ConnectionString, "auction");
app.get("/negotiate", async (req, res) => {
    let token = await serviceClient.getClientAccessToken();
    res.send(token.url);
});
app.get("/get-current-bid", async (req, res) => {
    res.send(200, currentBid);
})
app.post('/bid', async (req, res) => {
    const bidQuery = req.query.bid;
    try{
        const bid = parseInt(bidQuery);
        if (currentBid < bid) {
            currentBid = bid;
            await serviceClient.sendToAll({currentBid: currentBid});
        }
        res.send(200, currentBid);
    } catch (err){
        console.log(err);
        res.send(400, err);
    }
});