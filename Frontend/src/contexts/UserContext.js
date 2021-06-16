import React, {createContext, useState} from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {

    const user_token = localStorage.getItem("user_token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const id = localStorage.getItem("id");
    const pic = localStorage.getItem("pic");
    const bio = localStorage.getItem("bio");

    const [user, setUser] = useState({
        isUserLoggedIn: user_token ? true : false,
        id: id,
        name: name,
        email: email,
        pic: pic,
        bio: bio,
        user_token: user_token
    });

    return (
        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    );
}