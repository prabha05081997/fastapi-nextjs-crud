import React from "react";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";

const Header = ({title}) => {
    const [token, setToken] = useContext(UserContext);

    const handleLogout = () => {
        setToken(null);
    }

    return (
        <div className="has-text-centered m-6">
            <h1 className="title">{title}
            {token && (<button className="button" onClick={handleLogout}>Logout</button>)}
            </h1>
        </div>
    )
}

export default Header