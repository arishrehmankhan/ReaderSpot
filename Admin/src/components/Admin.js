import React, { useContext } from "react"
import { UserContext } from "../contexts/UserContext";
import { Switch, useHistory, useRouteMatch, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashbaord from "./Dashboard";
import PublishedArticles from "./PublishedArticles";
import ToBeVerifiedArticles from "./ToBeVerifiedArticles";
import ContactMessages from "./ContactMessages";
import Reports from "./Reports";
import "../styles/sb-admin-2.css";
import "../styles/custom.css";

const AdminDashboard = () => {

    const [ user, ] = useContext(UserContext);

    const history = useHistory();

    const { path } = useRouteMatch();

    if (!user.isAdminLoggedIn) {
        history.push("/admin/login");
    }

    return (
        <div id="wrapper">
            <Sidebar />
            <Switch>
                <Route exact path={`${path}/dashboard`} component={ Dashbaord }/>
                <Route exact path={`${path}/published-articles`} component={ PublishedArticles } />
                <Route exact path={`${path}/to-be-verified-articles`} component={ ToBeVerifiedArticles } />
                <Route exact path={`${path}/contact-messages`} component={ ContactMessages } />
                <Route exact path={`${path}/reports`} component={ Reports } />
            </Switch>
        </div>
    )
}

export default AdminDashboard
