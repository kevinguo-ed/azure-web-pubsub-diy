const express = require('express');

const port = 8088;
const app = express();

app.use(express.static("build"));
app.listen(port, ()=>console.log(`Open http://localhost:${port}`));