import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ArticleCreate from "./components/ArticleCreate";
import Article from "./components/Article";
import "./styles/custom.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Contact from "./components/Contact";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Header />
            <div className="container main-container">            
              <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/contact" component={Contact} />  
                  <Route exact path="/settings" component={Settings} />               
                  <Route exact path="/Signup" component={Signup} />
                  <Route path="/article/create" component={ArticleCreate} />
                  <Route path="/article/:id" component={Article} />
              </Switch>
            </div>
          <Footer />
          
        </BrowserRouter>
        <ToastContainer />
      </UserProvider>
    </div>
  );
}

export default App;
