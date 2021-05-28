import React,{ useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
// import classnames from 'classnames';
import FoodInventory from './FoodInventory'
import LaundaryInventory from './LaundaryInventory';
import HouseKeepingInventory from './HouseKeepingInventory';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000,
    marginLeft:"auto",
    marginRight:"auto"
  },
  normal:{
    background:"#e3f2fd",
    borderBottom:"2px solid #3f51b5"
  },
  selected:{
    background:"white",
    border:"2px solid #3f51b5",
    borderBottom:"0px"
  },
  white:{
    backgroundColor:"white",
    height:0
  },
  panel:{
    background:"white",
    border:"2px solid #3f51b5",
    borderTop:"0px"
  }
}));

function Inventory({ onSnackbarEvent }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{boxShadow:"none"}}>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor="primary"
          classes={{indicator:classes.white}}
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab classes={{root:classes.normal,selected:classes.selected}} label="FOOD" {...a11yProps(0)} />
          <Tab classes={{root:classes.normal,selected:classes.selected}} label="LAUNDARY" {...a11yProps(1)} />
          <Tab classes={{root:classes.normal,selected:classes.selected}} label="HOUSE KEEPING" {...a11yProps(2)} />
        </Tabs>
        </AppBar>
        <TabPanel classes={classes.panel} value={value} index={0} dir={theme.direction}>
          <FoodInventory  onSnackbarEvent={onSnackbarEvent}/>
        </TabPanel>
        <TabPanel style={{border:"2px solid #3f51b5",borderTop:"0px"}} value={value} index={1} dir={theme.direction}>
          <LaundaryInventory onSnackbarEvent={onSnackbarEvent} />
        </TabPanel>
        <TabPanel style={{border:"2px solid #3f51b5",borderTop:"0px"}} value={value} index={2} dir={theme.direction}>
          <HouseKeepingInventory onSnackbarEvent={onSnackbarEvent}/>
        </TabPanel>
    </div>
  );
}





export default Inventory;
