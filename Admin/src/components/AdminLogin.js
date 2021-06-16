import React, { useContext, useState } from "react";
import "../styles/admin-login.css";
import { toast } from "react-toastify";
import api from "../helpers/api";
import { useHistory } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const AdminLogin = () => {

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ user, setUser] = useContext(UserContext);

  const history = useHistory();

  if (user.isAdminLoggedIn) {
      history.push("/admin/dashboard");
  }

  const loginAdmin = (e) => {
    e.preventDefault();

    api.post("/admin/login", { username, password })
      .then((res) => {
        const status = res.data.status;
        // if there is some error in validation
        if (status === 0) {
          toast.warning(res.data.data);
        } else {
          toast.success(res.data.message);
          setUser({
            isAdminLoggedIn: true,
            admin_token: res.data.data.token
          });
          localStorage.setItem("admin_token", res.data.data.token);
          // go to admin dashboard
          history.push("/admin/dashboard");
        }
      }).catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <div>
        <form onSubmit={loginAdmin} class="form-signin">
            <img class="mb-4" src="https://www.sfdcpoint.com/wp-content/uploads/2019/01/Salesforce-Admin-Interview-questions.png" alt="" width="180" />
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label for="inputEmail" class="sr-only">Email address</label>
            <input onChange={(e) => setUsername(e.target.value) } type="text" id="inputEmail" class="form-control" placeholder="username" required="" autofocus="" />
            <label for="inputPassword" class="sr-only">Password</label>
            <input onChange={(e) => setPassword(e.target.value) } type="password" id="inputPassword" class="form-control" placeholder="Password" required="" />
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    </div>
  );
};

export default AdminLogin;
