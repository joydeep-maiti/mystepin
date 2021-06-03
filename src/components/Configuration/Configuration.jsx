import React, { useEffect, useState } from "react";
import taxService from "../../services/taxService";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Loader from "../../common/Loader/Loader";
import {
  makeStyles
} from "@material-ui/core";

import Taxes from "../Taxes/Taxes";
import Rooms from "../Rooms/Rooms";
import RoomCategory from "../RoomCategory/RoomCategory";
import SeasonMaster from "../SeasonMaster/SeasonMaster";
import RateMaster from "../RateMaster/RateMaster";
import PropertyDetails from "../PropertyDetails/PropertyDetails";
import Users from "../Users/Users";
import Inventory from "../Inventory/Inventory";
import AccessMngmt from "../AccessMngmt/AccessMngmt";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  inputItems: {
    width: "70%"
  },
  span: {
    color: "#f50057"
  },
  tabDiv: {
    padding: '0px 20px'
  }
}));

const Configuration = ({onSnackbarEvent,userData}) => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  // const [userPermissions, setUserPermissions] = React.useState(["Rooms", "Room Category", "Rate Master", "Season Master", "Taxes", "Property Details", "User Management", "Inventory", "Access Management"]);
  const [userPermissions, setUserPermissions] = React.useState([]);

  // const handleChange = (newValue) => {
  //   console.log("newValue",newValue)
  //   setValue(newValue);
  // };
  const handleChange = (event, newValue) => {
    console.log("newValue",newValue)
    setValue(newValue);
  };

  React.useEffect(()=>{
    console.log("props.userData per",userData)
    if(userData){
      setUserPermissions(userData.permissions)
    }
  },[userData])

  const getTabs = (permissions)=>{
    console.log(permissions)
    let i = -1
    return permissions.map((el)=>{
      switch(el){
        case "Rooms": i++;return <Tab label="Rooms" {...a11yProps(i)} /> 
        case "Room Category": i++;return <Tab label="Rooms Category" {...a11yProps(i)} /> 
        case "Rate Master": i++;return <Tab label="Rate Master" {...a11yProps(i)} /> 
        case "Season Master": i++;return <Tab label="Season Master" {...a11yProps(i)} /> 
        case "Taxes": i++;return <Tab label="Taxes" {...a11yProps(i)} /> 
        case "Property Details": i++;return <Tab label="Property Details" {...a11yProps(i)} /> 
        case "User Management": i++;return <Tab label="User Management" {...a11yProps(i)} /> 
        case "Inventory": i++;return <Tab label="Inventory" {...a11yProps(i)} /> 
        case "Access": i++;return <Tab label="Access" {...a11yProps(i)} /> 
      }
    })
  }

  const getTabPanels = (permissions)=>{
    let i = -1
    return permissions.map((el)=>{
      switch(el){
        case "Rooms": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><Rooms onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Room Category": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><RoomCategory onSnackbarEvent={onSnackbarEvent} /></TabPanel> 
        case "Rate Master": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><RateMaster onSnackbarEvent={onSnackbarEvent} /></TabPanel> 
        case "Season Master": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><SeasonMaster onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Taxes": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><Taxes onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Property Details": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><PropertyDetails onSnackbarEvent={onSnackbarEvent} /></TabPanel> 
        case "User Management": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><Users onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Inventory": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><Inventory onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Access": i++;return <TabPanel className={classes.tabDiv} value={value} index={i}><AccessMngmt onSnackbarEvent={onSnackbarEvent} /></TabPanel> 
      }
    })
  }


  return (
    <div className={classes.root} style={{backgroundColor:'#D6EAF8',height:"inherit"}}>
      <AppBar position="sticky" color="default" style={{position:"sticky",top:"64px"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        > 
        {
          getTabs(userPermissions)
        }
          
          {/* <Tab label="Rooms" />
          <Tab label="Room Category" onClick={()=>handleChange(1)}/>
          <Tab label="Rate Master"  onClick={()=>handleChange(2)}/>
          <Tab label="Season Master" onClick={()=>handleChange(3)} />
          <Tab label="Taxes" onClick={()=>handleChange(4)} />
          <Tab label="Property Details" onClick={()=>handleChange(5)} />
          <Tab label="User Management" onClick={()=>handleChange(6)} />
          <Tab label="Inventory" onClick={()=>handleChange(7)} />
          <Tab label="Access" onClick={()=>handleChange(8)} /> */}

          {/* <Tab label="Rooms" {...a11yProps(0)} />
          <Tab label="Room Category" {...a11yProps(1)} onClick={()=>handleChange(1)}/>
          <Tab label="Rate Master" {...a11yProps(2)}  onClick={()=>handleChange(2)}/>
          <Tab label="Season Master" {...a11yProps(3)} onClick={()=>handleChange(3)} />
          <Tab label="Taxes" {...a11yProps(4)} onClick={()=>handleChange(4)} />
          <Tab label="Property Details" {...a11yProps(5)} onClick={()=>handleChange(5)} />
          <Tab label="User Management" {...a11yProps(6)} onClick={()=>handleChange(6)} />
          <Tab label="Inventory" {...a11yProps(7)} onClick={()=>handleChange(7)} />
          <Tab label="Access" {...a11yProps(8)} onClick={()=>handleChange(8)} /> */}
        </Tabs>
      </AppBar>
      {getTabPanels(userPermissions)}
      {/* <TabPanel className={classes.tabDiv} value={value} index={0}>
        {userPermissions.includes("Rooms")?<Rooms onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={1}>
        {userPermissions.includes("Room Category")?<RoomCategory onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={2}>
        {userPermissions.includes("Rate Master")?<RateMaster onSnackbarEvent={onSnackbarEvent}/>:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={3}>
      {userPermissions.includes("Season Master")?<SeasonMaster onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={4}>
        {userPermissions.includes("Taxes") ?<Taxes onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={5}>
      {userPermissions.includes("Property Details")?<PropertyDetails onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={6}>
      {userPermissions.includes("User Management")?<Users onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={7}>
      {userPermissions.includes("Inventory")?<Inventory onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={8}>
      {userPermissions.includes("Access Management")?<AccessMngmt onSnackbarEvent={onSnackbarEvent} />:<h1>You Dont have access to view this.</h1>}
      </TabPanel> */}
    </div>
  );
};

export default Configuration;
