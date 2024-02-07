import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ClientPage from "./components/clientPage";
import LoginPage from "./components/login";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <h1> Client Page </h1> */}
          <Route exact path="/" element={<LoginPage />}></Route>
          <Route exact path="/client" element={<ClientPage />}></Route>
          {/* <ClientPage/> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
