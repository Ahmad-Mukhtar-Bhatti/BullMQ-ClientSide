const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Queue } = require("bullmq");
const Redis = require("ioredis");


const app = express();
app.use(cors());
const port = 3001;

// Middleware to parse JSON data
app.use(bodyParser.json());


// Creating redis connection on the backend
const redisClient = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
});



const queue = new Queue("myQueue", { connection: redisClient });

// Map to store clients 
const clients = new Map();

function addData(data, clientId) {
    try {
      // const clientData = JSON.parse(message);
      const clientData = data;
  
    //   if (clientId && clientData[0] && clientData.length > 0) {
    //     clients.set(clientId + clientData[0].batchID, socket);
    //   } else {
    //     console.log("Invalid client data received.");
    //     return; // Exit early if clientData is null or empty
    //   }
  
      clientData.forEach(async (task) => {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        const taskID =
          task.user + task.appID + task.batchID + `_${timestamp}${random}`;
        console.log("Taksk ID", taskID);
        const taskObj = {
          id: taskID,
          name: task.user + task.appID + task.batchID,
          data: { someKey: task.data },
          totalData: task.totalData,
        };
        try {
          await queue.add(
            taskObj.name,
            taskObj.data,
            {
              jobId: taskObj.id,
              totalData: taskObj.totalData,
            },
            { attempts: 2 }
          );
        } catch (error) {
          console.log("Error adding task to the queue:", error);
        }
      });
    } catch (error) {
      console.log("Error processing message:", error);
    }
}



// POST endpoint to handle data from the React client
app.post("/api/submitData", (req, res) => {
  const receivedData = req.body;
  console.log("Data received from client:", receivedData.clientId);

  addData(receivedData.tasks, receivedData.clientId);
  // Send a response back to the client
  res.json({ message: "Data received successfully!" });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
