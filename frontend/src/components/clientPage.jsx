import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Box } from "@material-ui/core";
import "./clientPage.css";

import ProgressBar from "@ramonak/react-progress-bar";

const WebSocketClient = () => {
  const socketRef = useRef(null);

  const [totprogress, setProgress] = useState("00");
  const [showBar, setShowBar] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);

  const [failed, setFailed] = useState(false);
  const [failedTasks, setFailedTasks] = useState(0);

  const [id, setId] = useState(0);

  // Recieving client name from login page
  const location = useLocation();
  const { state } = location;

  // if (!state) {
  //   console.error("No state received");
  //   console.log("data recieved", state)
  //   // Handle the case where state is not present (e.g., direct URL visit)
  //   return <div>No data received</div>;
  // }

  const { clientName, name, appName } = state;

  useEffect(() => {
    // Access clientName and use it in your WebSocket logic
    console.log("Received clientName:", clientName, name, appName);

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

    socketRef.current.addEventListener("error", (err) => {
      console.log("Error connecting", err);
    });

    // socketRef.current.addEventListener("close", () => {
    //   console.log("WebServer is closed");
    // });

    // Listen for messages from the server
    socketRef.current.addEventListener("message", (event) => {
      console.log(`Received from server: ${event.data}`);
      const prog = Number(
        String(event.data).substring(event.data.length - 3, event.data.length)
      );
      if (event.data == "Your Job has failed!") {
        setFailed(true);
        setFailedTasks(failedTasks + 1);
        setTotalTasks(totalTasks - 1);
        console.log("Check on fail", totalTasks);
        if (totalTasks <= 1) {
          setShowBox(false);
        }
      }
      // console.log("reccc", String(prog));
      if (!isNaN(prog)) {
        setTimeout(() => setFailed(false), 2000);
        setProgress(prog);
      }

      if (prog === 100) {
        if (totalTasks <= 1) {
          setTimeout(() => {
            setShowBar(false);
            setProgress(0);
          }, 1000);
          setShowBox(false);
        }
        setTotalTasks(totalTasks - 1);
      }

      if (prog === 0) setProgress(0);
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [clientName, totalTasks]);

  // Send a message to the server
  const sendMessage = async () => {
    setId(id + 1);

    console.log("Data Sent!");
    setShowBar(true);
    setTimeout(() => setShowBox(true), 1000);
    setTotalTasks(totalTasks + 1);

    const tasks = Array.from({ length: 10 }, () => ({
      user: name,
      appID: appName,
      totalData: "10",
      // batchID: idRef,
      batchID: id,
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

      {showBar && (
        <div className="cp-bottombox">
          {failedTasks > 0 && (
            <Box className="cp-failedCountBox">
              <h3>{failedTasks} Failed Tasks</h3>
            </Box>
          )}
          {totalTasks > 1 && (
            <Box className="cp-pendingbox">
              <h3>{totalTasks - 1} Pending Tasks</h3>
            </Box>
          )}
          {!failed && (
            <Box className={`cp-progress ${showBox ? "visible" : ""}`}>
              <h3>JOB PROGRESS</h3>
              <ProgressBar
                animateOnRender={true}
                bgColor={"#3e6296"}
                completed={totprogress}
              />
            </Box>
          )}
          {failed && (
            <Box className={`cp-failedbox ${showBox ? "nonvisible" : ""}`}>
              <h3>JOB FAILED!</h3>
            </Box>
          )}
        </div>
      )}
    </>
  );
};

export default WebSocketClient;
