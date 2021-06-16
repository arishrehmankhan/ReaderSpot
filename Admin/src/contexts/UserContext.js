import React, {createContext, useState} from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    const admin_token = localStorage.getItem("admin_token");

    const [user, setUser] = useState({
        admin_token: admin_token
    });

    return (
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    );
}