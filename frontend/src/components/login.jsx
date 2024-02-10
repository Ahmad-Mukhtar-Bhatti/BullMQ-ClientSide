import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [appName, setAppName] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAppNameChange = (e) => {
    setAppName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    console.log("Name:\t", name);
    console.log("Application Name:\t", appName);

    const clientName = name + appName;
    navigate("/client", {state: { clientName, name, appName}});
  };

  return (
    <div>
      <h1>Login Page</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Name:&nbsp;&nbsp;&nbsp;
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <br />
        <label>
          Application Name:&nbsp;&nbsp;&nbsp;
          <input type="text" value={appName} onChange={handleAppNameChange} />
        </label>
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
