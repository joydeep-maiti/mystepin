import React, { useEffect, useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core";
import BillingDetails from "../BillingDetails/BillingDetails";
import BillingTab from '../BookingTab/BookingTab';
import PoSSales from '../POSSales/POSSales';
import Agent from '../Agent/Agent';
import Occupancy from '../Occupancy/Occupancy';
import CollectionReport from '../CollectionReport/CollectionReport';
import GuestDetails from '../GuestDetails/GuestDetails';


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

const ReportComponent = ({ onSnackbarEvent, userData }) => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabvalue, setValue] = React.useState(0);
  const [userPermissions, setUserPermissions] = React.useState([]);


  React.useEffect(() => {
    console.log("props.userData per", userData)
    if (userData) {
      setUserPermissions(userData.permissions)
    }
  }, [userData])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTabs = (permissions) => {
    console.log(permissions)
    let i = -1
    return permissions.map((el) => {
      switch (el) {
        case "Billing Details": i++; return <Tab label="Billing Details" {...a11yProps(i)} />
        case "Booking Report": i++; return <Tab label="Booking Report" {...a11yProps(i)} />
        case "POS Sales": i++; return <Tab label="POS Sales" {...a11yProps(i)} />
        case "Agent": i++; return <Tab label="Agent" {...a11yProps(i)} />
        case "Occupancy": i++; return <Tab label="Occupancy" {...a11yProps(i)} />
        case "Collection Report": i++; return <Tab label="Collection Report" {...a11yProps(i)} />
        case "Guest Details": i++; return <Tab label="Guest Details" {...a11yProps(i)} />
      }
    })
  }

  const getTabPanels = (permissions) => {
    let i = -1
    return permissions.map((el) => {
      switch (el) {
        case "Billing Details": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><BillingDetails onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Booking Report": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><BillingTab onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "POS Sales": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><PoSSales onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Agent": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><Agent onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Occupancy": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><Occupancy onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Collection Report": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><CollectionReport onSnackbarEvent={onSnackbarEvent} /></TabPanel>
        case "Guest Details": i++; return <TabPanel className={classes.tabDiv} value={tabvalue} index={i}><GuestDetails onSnackbarEvent={onSnackbarEvent} /></TabPanel>
      }
    })
  }

    return (
      <div className={classes.root} style={{ backgroundColor: '#D6EAF8', height: "100vh" }}>
        <AppBar position="sticky" color="default" style={{ position: "sticky", top: "64px" }}>
          <Tabs
            value={tabvalue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {getTabs(userPermissions)}
            {/* <Tab label="Billing Details" {...a11yProps(0)} />
            <Tab label="Booking" {...a11yProps(1)} />
            <Tab label="POS Sales" {...a11yProps(2)} />
            <Tab label="Agent" {...a11yProps(3)} />
            <Tab label="Occupancy" {...a11yProps(4)} />
            <Tab label="Collection Report" {...a11yProps(5)} />
            <Tab label="Guest Details" {...a11yProps(6)} /> */}
          </Tabs>
        </AppBar>
        {getTabPanels(userPermissions)}
        {/* <TabPanel className={classes.tabDiv} value={tabvalue} index={0}>
          <BillingDetails />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={1}>
          <BillingTab />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={2}>
          <PoSSales />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={3}>
          <Agent />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={4}>
          <Occupancy />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={5}>
          <CollectionReport />
        </TabPanel>
        <TabPanel className={classes.tabDiv} value={tabvalue} index={6}>
          <GuestDetails />
        </TabPanel> */}
      </div>
    );
  };

  export default ReportComponent;
