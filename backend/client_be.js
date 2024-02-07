const { Queue } = require("bullmq");
const Redis = require("ioredis");

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const queue = new Queue("myQueue", { connection: redisClient });

function addData(data, clientId) {
  try {
    // const clientData = JSON.parse(message);
    const clientData = data;

    if (clientId && clientData[0] && clientData.length > 0) {
      clients.set(clientId + clientData[0].batchID, socket);
    } else {
      console.log("Invalid client data received.");
      return; // Exit early if clientData is null or empty
    }

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

const socket = new WebSocket(`ws://localhost:3000?clientId=${clientId}`);

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to server");
});

// Listen for messages from the server
socket.addEventListener("message", (event) => {
  console.log(`Received from server: ${event.data}`);
});

function sendMessage() {
  const clientId = "Client1ets";
  let id = 0;

  console.log("Data Sent!");
  const tasks = [
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
    { user: "Client1", appID: "ets", totalData: "10", batchID: id, data: "" },
  ];
  addData(tasks, id);
  id = id + 1;
}

module.exports = sendMessage;
