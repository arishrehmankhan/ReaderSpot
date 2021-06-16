import React, { useContext } from "react"
import { UserContext } from "../contexts/UserContext";
import { Switch, useHistory, useRouteMatch, Route } from "react-router-dom";
import "../styles/Admin/sb-admin-2.css";
import AdminSidebar from "./AdminSidebar";
import AdminDashbaord from "./AdminDashboard";
import AdminPublishedArticles from "./AdminPublishedArticles";
import AdminToBeVerifiedArticles from "./AdminToBeVerifiedArticles";
import AdminContactMessages from "./AdminContactMessages";
import AdminReports from "./AdminReports";

const AdminDashboard = () => {

    const [ user, ] = useContext(UserContext);

    const history = useHistory();

    const { path } = useRouteMatch();

    if (!user.isAdminLoggedIn) {
        history.push("/admin/login");
    }

    return (
        <div id="wrapper">
            <AdminSidebar />
            <Switch>
                <Route exact path={`${path}/dashboard`} component={ AdminDashbaord }/>
                <Route exact path={`${path}/published-articles`} component={ AdminPublishedArticles } />
                <Route exact path={`${path}/to-be-verified-articles`} component={ AdminToBeVerifiedArticles } />
                <Route exact path={`${path}/contact-messages`} component={ AdminContactMessages } />
                <Route exact path={`${path}/reports`} component={ AdminReports } />
            </Switch>
        </div>
    )
}

export default AdminDashboard
