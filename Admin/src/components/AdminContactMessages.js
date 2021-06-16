import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";

const AdminContactMessages = () => {

  const [user, setUser] = useContext(UserContext);

  const [contactMessages, setContactMessages] = useState([]);

  useEffect(() => {
    getContactMessages();
  }, []);

  const getContactMessages = async () => {
    const res = await api.get(`/admin/contact-messages`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      setContactMessages(res.data.data);
    }
  };

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Contact Messages</h1>
          </div>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Message</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages &&
                contactMessages.map((message) => {
                  return (
                    <tr key={message._id}>
                      <th scope="row">{message._id}</th>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.message}</td>
                      <td>
                        <Moment format="MMM DD, YYYY h:m a">
                          {message.createdAt}
                        </Moment>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessages;
