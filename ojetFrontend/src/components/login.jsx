import { h, Component } from "preact";
import WebSocketClient from "./clientPage";
// import { Router } from "preact-router";

export default class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      appName: "",
      loggedIn: false,
    };
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleAppNameChange = (e) => {
    this.setState({ appName: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    console.log("Name:\t", this.state.name);
    console.log("Application Name:\t", this.state.appName);

    const clientName = this.state.name + this.state.appName;

    this.setState({ loggedIn: true });

    console.log("Client Name logged in:\t", clientName, this.state.loggedIn);
    // Router("/client", { state: { clientName, name: this.state.name, appName: this.state.appName } });
  };

  render() {
    return (
      <div>
        {!this.state.loggedIn && (
          <>
            <h1>Login Page</h1>
            <br />
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </label>
              <br />
              <br />
              <label>
                Application Name:&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  value={this.state.appName}
                  onChange={this.handleAppNameChange}
                />
              </label>
              <br />
              <br />
              <button type="submit">Login</button>
            </form>
          </>
        )}
        
        {
        this.state.loggedIn && (
          <WebSocketClient
            name={this.state.name}
            appName={this.state.appName}
          />
        )}
      </div>
    );
  }
}
