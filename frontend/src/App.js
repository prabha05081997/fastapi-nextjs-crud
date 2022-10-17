import React, { useContext, useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";

import Register from "./components/Register";
import Table from "./components/Table";
import { UserContext } from "./context/UserContext";

const App = () => {
  const [message, setMessage] = useState("");
  const [token,] = useContext(UserContext);

  const getWelomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    };

    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("error happened");
    } else {
      setMessage(data.message)
    }
  }

  useEffect(() => {
    getWelomeMessage();
  }, [])
  return (
    <>
      <Header title={message} />
      <div className="columns">
        {/* <div className="column"></div> */}
        <div className="column m-5 is-one-thirds">
          {
            !token ? (
              <div className="columns">
                <Register /><Login />
              </div>
            ) : (
              <Table />
            )
          }
        </div>
      </div>
    </>

  );
}

export default App;
