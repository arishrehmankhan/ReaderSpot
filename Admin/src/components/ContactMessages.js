import React, { useEffect, useContext, useState } from "react";
import api from "../helpers/api";
import { UserContext } from "../contexts/UserContext";
import Moment from "react-moment";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AdminContactMessages = () => {
  const [user] = useContext(UserContext);
  const [contactMessages, setContactMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToBeDeleted, setMessageToBeDeleted] = useState();

  // modal config
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  // for table
  var data = {
    columns: [
      {
        label: "DateTime",
        field: "createdAt",
        sort: "desc",
      },
      {
        label: "Name",
        field: "name",
        sort: "asc",
      },
      {
        label: "Email",
        field: "email",
        sort: "asc",
      },
      {
        label: "Message",
        field: "query",
        sort: "asc",
      },
      {
        label: "Actions",
        field: "actions",
      },
    ],
    rows: contactMessages,
  };

  useEffect(() => {
    getContactMessages();
  }, []);

  const getContactMessages = async () => {
    const res = await api.get(`/admin/contact-messages`, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      var messages = await res.data.data.map((message) => {
        return {
          name: message.name,
          email: message.email,
          query: message.message,
          createdAt: (
            <Moment format="MMM DD, YYYY hh:mm a" date={message.createdAt} />
          ),
          actions: (
            <div>
              <button
                onClick={(e) => reply(e, message.email)}
                className="btn btn-primary btn-sm rounded-0 hide-show-btn"
                type="button"
                title="Open"
              >
                Reply
              </button>
              <button
                onClick={(e) => openModal(e, message._id)}
                className="btn btn-danger btn-sm rounded-0"
                type="button"
                title="Open"
              >
                Delete
              </button>
            </div>
          ),
        };
      });
      setContactMessages(messages);
      console.log(messages);
    }
  };

  const reply = async (e, email) => {
    e.stopPropagation();
    window.location.href = "mailto:" + email;
  };

  const openModal = (e, messageId) => {
    e.stopPropagation();
    setMessageToBeDeleted(messageId);
    setIsModalOpen(true);
  };

  const deleteContactMessage = async (messageId) => {
    const body = {
      messageId: messageId,
    };
    const res = await api.post(`/admin/delete-contact-message`, body, {
      headers: { "auth-token": user.admin_token },
    });
    if (res.data.status === 1) {
      toast.success(res.data.message);
      getContactMessages();
    } else {
      toast.warning("Some error occurred");
    }
    setIsModalOpen(false);
  };

  return (
    <div id="content-wrapper" className="d-flex flex-column">
      <div className="content">
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Contact Messages</h1>
          </div>
          <MDBDataTable hover bordered small data={data} />
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            contentLabel="Modal"
            ariaHideApp={false}
          >
            <i
              onClick={() => setIsModalOpen(false)}
              className="close-btn fa fa-times"
            ></i>
            <h4 className="modal-text">Are you sure?</h4>
            <button
              onClick={() => deleteContactMessage(messageToBeDeleted)}
              className="btn btn-danger btn-sm rounded-0 float-right"
              type="button"
              title="Yes Delete"
            >
              Yes, Delete It
            </button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessages;
