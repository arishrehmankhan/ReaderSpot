import React from "react";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
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
import { AdminProvider } from "./contexts/AdminContext";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App(props) {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <AdminProvider>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          </AdminProvider>
          <div>
            <UserProvider>
              <div className="container main-container">
                <Header />
                <Route exact path="/" component={Home} />
                <Route path="/article-create" component={ArticleCreate} />
                <Route path="/login" component={Login} />
                <Route path="/profile" component={Profile} />
                <Route path="/contact" component={Contact} />
                <Route path="/settings" component={Settings} />
                <Route path="/Signup" component={Signup} />
                <Route path="/About" component={About} />
                <Route path="/article/:id" component={Article} />
              </div>
            </UserProvider> 
            <Footer />
          </div>
        </Switch>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
