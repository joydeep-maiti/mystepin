import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";

const App = (props) => {

  const [userData, setUserData] = React.useState(null)

  const handleUserLogin = (_userData)=>{
    console.log("UserLoggedin")
    setUserData(_userData)
    props.history.push("/")
  }

  return (
    <div style={{ height: "100%" }}>
      <Switch>
        <Route path="/login" render={()=><Login onLoggedIn={handleUserLogin}/>} />
        <Route path="/" render={()=><Dashboard userData={userData}/>}/>
      </Switch>
    </div>
  );
};

export default withRouter(App);
