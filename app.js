const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const Cabin = require("cabin");
const Bree = require('bree');
const path = require('path');

// const getBlocksUpdates = require('./services/getBlocksUpdates_copy');

// getBlocksUpdates();


  const bree = new Bree({
    logger: new Cabin(),
    jobs: [
      {
        name: 'getBlocksUpdates',
        interval: '5s'
      }
    ],
    root: path.join(__dirname, 'services'),
  })

 bree.start()



const formatsLogger = app.get("env") === "development" ? "dev" : "short";


const transactionsRouter = require("./routes/api/transactions");

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());


app.use('/api/transactions', transactionsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


module.exports = app;