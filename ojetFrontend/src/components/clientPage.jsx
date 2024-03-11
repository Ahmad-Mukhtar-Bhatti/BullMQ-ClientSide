import { h, Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
// import axios from "axios";
// import axios from 'axios';

// Your component code here

// import { useLocation } from 'preact-router';
// import { Box } from '@material-ui/core';
// import ProgressBar from '@ramonak/react-progress-bar';
// import "../styles/clientPage.css";

import "ojs/ojprogress-bar";

const WebSocketClient = (props) => {
  const socketRef = useRef(null);

  const [totprogress, setProgress] = useState("00");
  const [showBar, setShowBar] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);

  const [failed, setFailed] = useState(false);
  const [failedTasks, setFailedTasks] = useState(0);

  const [id, setId] = useState(0);

  // Recieving client name from login page

  const { name, appName } = props;
  const clientName = name + appName;

  useEffect(() => {
    // Initialize WebSocket connection
    console.log("Name sent is " + clientName);
    socketRef.current = new WebSocket(
      `ws://localhost:3000?clientId=${clientName}`
    );

    // Connection opened
    socketRef.current.addEventListener("open", () => {
      console.log("Connected to server");
      async function newClient() {
        try {
          const data = { clientId: clientName };

          const response = await fetch(
            "http://localhost:3001/api/queueCreation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Adjust the content type based on your backend expectations
                // Add any other headers if needed
              },
              body: JSON.stringify(data),
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          // Parse the response based on the expected format (JSON in this case)
          const responseData = await response.json();

          // Handle the response data as needed
          console.log("Success:", responseData);
        } catch (error) {
          // Handle errors
          console.error("Error sending data to backend:", error);
        }
      }
      newClient();
    });

    socketRef.current.addEventListener("error", (err) => {
      console.log("Error connecting", err);
    });

    socketRef.current.addEventListener("close", () => {
      console.log("WebServer is closed");
    });

    // Listen for messages from the server
    socketRef.current.addEventListener("message", (event) => {
      console.log(`Received from server: ${event.data}`);
      const prog = Number(String(event.data.split(":")[1]));
      if (event.data == "Your Job has failed!") {
        setFailed(true);
        setFailedTasks(failedTasks + 1);
        setTotalTasks(totalTasks - 1);
        if (totalTasks <= 1) {
          setTimeout(() => {
            setShowBox(false);
            setFailed(false);
          }, 2000);
          setProgress(0);
        }
      }

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
      batchID: id,
      data: "",
    }));

    // Send tasks array to the backend
    try {
      const tasks = Array.from({ length: 10 }, () => ({
        user: name,
        appID: appName,
        totalData: "10",
        batchID: id,
        data: "",
      }));

      // Make a POST request
      const response = await fetch("http://localhost:3001/api/submitData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks, clientId: clientName }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the response based on the expected format (JSON in this case)
      const responseData = await response.json();

      // Handle the response data as needed
      console.log("Response from backend:", responseData);
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
            <div className={`cp-failedCountBox ${!showBox ? "below" : ""}`}>
              <h3>{failedTasks} Failed Tasks</h3>
            </div>
          )}
          {!failed && (
            <div className={`cp-progress ${showBox ? "visible" : ""}`}>
              <h3>JOB PROGRESS</h3>
              <p>Progress: {totprogress} %</p>
              <oj-progress-bar
                className="cp-progressbar"
                value={totprogress}
              ></oj-progress-bar>
              <p>Tasks Pending: {totalTasks - 1 >= 0 ? totalTasks - 1 : 0}</p>
            </div>
          )}
          {failed && (
            <div className={`cp-failedbox ${!showBox ? "nonvisible" : ""}`}>
              <h3>JOB FAILED!</h3>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WebSocketClient;
