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
  tabDiv:{
    padding:"20px"
  }
}));

const Configuration = () => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Taxes" {...a11yProps(0)} />
          <Tab label="Rooms" {...a11yProps(1)} />
          <Tab label="Room Category" {...a11yProps(2)} />
          <Tab label="Rate Master" {...a11yProps(3)} />
          <Tab label="Season Master" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel className={classes.tabDiv} value={value} index={0}>
        <Taxes/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={1}>
        <Rooms/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={2}>
        <RoomCategory />
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={3}>
      Rate Master
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={value} index={4}>
        <SeasonMaster />
      </TabPanel>
    </div>
  );
};

export default Configuration;
