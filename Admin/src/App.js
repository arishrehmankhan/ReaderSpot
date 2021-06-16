import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
    <UserProvider>
      <BrowserRouter>
        <Switch>
            <Route exact path="/admin/login" component={Login} />
            <Route path="/admin">
              <Admin />
            </Route>
          </Switch>
        </BrowserRouter>
        <ToastContainer />
      </UserProvider>
    </div>
  );
}

export default App;
