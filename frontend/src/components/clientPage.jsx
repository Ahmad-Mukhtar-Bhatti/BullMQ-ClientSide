import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const WebSocketClient = () => {
  const clientId = "Client1ets";
  const idRef = useRef(0).current;
  const socketRef = useRef(null);

  const [totprogress, setProgress] = useState("30");

  // Recieving client name from login page
  const location = useLocation();
  const { state } = location;

  // if (!state) {
  //   console.error("No state received");
  //   console.log("data recieved", state)
  //   // Handle the case where state is not present (e.g., direct URL visit)
  //   return <div>No data received</div>;
  // }
  
  const { clientName, name, appName} = state;

  useEffect(() => {
    // Access clientName and use it in your WebSocket logic
    console.log('Received clientName:', clientName, name, appName);

    // Your WebSocket logic here
  }, [clientName]);


  useEffect(() => {
    // Initialize WebSocket connection
    console.log("Name sent is " + clientName);
    socketRef.current = new WebSocket(
      `ws://localhost:3000?clientId=${clientName}`
    );

    // Connection opened
    socketRef.current.addEventListener("open", () => {
      console.log("Connected to server");
    });

    // Listen for messages from the server
    socketRef.current.addEventListener("message", (event) => {
      console.log(`Received from server: ${event.data}`);
      const prog = Number(
        String(event.data).substring(event.data.length - 3, event.data.length)
      );
      console.log("reccc", String(prog));
      setProgress(prog);

      if (prog === 0) setProgress(0);
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [clientName]);

  // Send a message to the server
  const sendMessage = async () => {
    console.log("Data Sent!");
    const tasks = Array.from({ length: 10 }, () => ({
      user: name,
      appID: appName,
      totalData: "10",
      // batchID: idRef,
      batchID: 100,
      data: "",
    }));

    // Send tasks array to the backend
    try {
      // Replace 'YOUR_BACKEND_API_ENDPOINT' with your actual backend API endpoint
      const response = await axios.post(
        "http://localhost:3001/api/submitData",
        { tasks: tasks, clientId: clientName }
      );
      // Handle the response if needed
      console.log("Response from backend:", response.data);
    } catch (error) {
      // Handle errors
      console.error("Error sending data to backend:", error);
    }
  };

  // const sendMessage = () => {
  //   console.log("Data Sent!");
  //   const tasks = Array.from({ length: 10 }, () => ({
  //     user: "Client1",
  //     appID: "ets",
  //     totalData: "10",
  //     batchID: idRef.current,
  //     data: "",
  //   }));

  //   if (socketRef.current.readyState === WebSocket.OPEN) {
  //     socketRef.current.send(JSON.stringify(tasks));
  //     idRef.current = idRef.current + 1;
  //   } else {
  //     console.error("WebSocket connection not open.");
  //   }
  // };

  return (
    <>
      <h1>Client Page</h1>
      <button
        onClick={sendMessage}
        style={{
          fontSize: "16px",
          padding: "10px",
          borderRadius: "10px",
          marginTop: "15px",
          marginLeft: "15px",
        }}
      >
        Send message
      </button>
      <br />
      <br />

      <progress
        className="progress"
        value={totprogress}
        max="100"
        style={{ width: "400px", height: "40px" }}
      >
        {" "}
        totprogress
      </progress>
    </>
  );
};

export default WebSocketClient;
