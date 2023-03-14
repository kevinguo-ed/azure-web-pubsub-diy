const express = require('express');
const app = express();

const port = 8888;
let currentBid = 18000;
app.use(express.static('public'));
app.listen(port, () => console.log(`Open http://localhost:${port}/index.html`));

app.get("/currentBid", async (req, res) => {
    res.status(200).send(currentBid.toString());
})
app.post('/bid', async (req, res) => {
    const bidQuery = req.query.bid;
    try{
        const bid = parseInt(bidQuery);
        if (currentBid < bid) {
            // get the max bid
            currentBid = bid;
        }

        // return the max bid
        res.status(200).send(currentBid.toString());
    } catch (err){
        console.log(err);
        res.status(400).send(err);
    }
});