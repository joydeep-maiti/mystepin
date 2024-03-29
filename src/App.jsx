import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import IdProof from './components/IdProof/IdProof'
import userService from './services/userService'

const App = (props) => {

  const [userData, setUserData] = React.useState(null)

  const handleUserLogout = async()=>{
    const res = await userService.logout({username:userData.username})
    console.log("res", res)
    if (res.status===200) {
        setUserData(null)
        props.history.push("/login")
    }
  }

  const handleUserLogin = (_userData)=>{
    console.log("UserLoggedin")
    setUserData(_userData)
    props.history.push("/")
  }


  return (
    <div style={{ height: "100%" }}>
      <Switch>
        <Route path="/login" render={()=><Login onLoggedIn={handleUserLogin}/>} />
        <Route path="/idproof/:id" render={props => (<IdProof/>)}/>
        <Route path="/" render={()=><Dashboard userData={userData} onLogout={handleUserLogout}/>}/>
      </Switch>
    </div>
  );
};

export default withRouter(App);
