import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";

const App = () => {

  const [userData, setUserData] = React.useState(null)

  const handleUserLogin = (_userData)=>{
    console.log("UserLoggedin")
    setUserData(_userData)
  }

  return (
    <div style={{ height: "100%" }}>
      <Switch>
        <Route path="/login" render={()=><Login onLoggedIn={handleUserLogin}/>} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </div>
  );
};

export default App;
