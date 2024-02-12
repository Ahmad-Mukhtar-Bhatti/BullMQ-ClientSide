const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Queue } = require("bullmq");
const Redis = require("ioredis");
const logger = require("./logger");
const error = require("./asyncErrors");
const config = require("./config/default.json");

const app = express();
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// Creating redis connection on the backend
const redisClient = new Redis(config.redis);

logger.info("Inside ReactBackend!");

const queue = new Queue(config.queue, {
  connection: redisClient,
  // limiter: { max: 10, duration: 1000 }, // Optional rate limiter configuration
  concurrency: 5,
});

function addData(data) {
  try {
    data.forEach(async (task) => {
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      const taskID =
        task.user + task.appID + "-" + task.batchID + `_${timestamp}${random}`;
      logger.info(`Taksk ID  ${taskID}`);
      const taskObj = {
        id: taskID,
        name: task.user + task.appID + "-" + task.batchID,
        data: { someKey: task.data },
        totalData: task.totalData,
      };

      await queue.add(
        taskObj.name,
        taskObj.data,
        {
          jobId: taskObj.id,
          totalData: taskObj.totalData,
        },
        { attempts: config.retryAttempts }
      );
    });
  } catch (error) {
    logger.error("Error processing message:", error);
  }
}

// POST endpoint to handle data from the React client
app.post(config.apiGetData, (req, res) => {
  const receivedData = req.body;
  logger.info("Data received from client:", receivedData.clientId);

  addData(receivedData.tasks, receivedData.clientId);
  // Send a response back to the client
  res.json({ message: "Data received successfully!" });
});

app.use(error);
// Start the server
app.listen(config.clientPort, () => {
  logger.info(`Server is running on http://localhost:${config.clientPort}`);
});
