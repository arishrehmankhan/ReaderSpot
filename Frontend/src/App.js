import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ArticleCreate from "./components/ArticleCreate";
import Article from "./components/Article";
import "./styles/custom.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Contact from "./components/Contact";
import About from "./components/About";
import { UserProvider } from "./contexts/UserContext";
import AdminLogin from "./components/AdminLogin";
import Admin from "./components/Admin";
import SavedArticles from "./components/SavedArticles";

function App(props) {
  return (
    <div className="App">
    <UserProvider>
      <BrowserRouter>
        <Switch>
              <Route exact path="/admin/login" component={AdminLogin} />
              <Route path="/admin">
                <Admin />
              </Route>
          <div>
              <div className="container main-container">
                <Header />
                <Route exact path="/" component={Home} />
                <Route path="/article-create" component={ArticleCreate} />
                <Route path="/login" component={Login} />
                <Route path="/saved-articles" component={SavedArticles} />
                <Route path="/profile" component={Profile} />
                <Route path="/contact" component={Contact} />
                <Route path="/settings" component={Settings} />
                <Route path="/signup" component={Signup} />
                <Route path="/about" component={About} />
                <Route path="/article/:id" component={Article} />
              </div>
            <Footer />
          </div>
        </Switch>
      </BrowserRouter>
      <ToastContainer />
            </UserProvider> 
    </div>
  );
}

export default App;
