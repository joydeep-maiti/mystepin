import React, { useEffect, useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles} from "@material-ui/core";
import BillingDetails from "../BillingDetails/BillingDetails";
import BillingTab from '../BookingTab/BookingTab';
import PoSSales from '../POSSales/POSSales';
import Agent from '../Agent/Agent';
import Occupancy from '../Occupancy/Occupancy';
import CollectionReport from '../CollectionReport/CollectionReport';
import GuestDetails from '../GuestDetails/GuestDetails';
import Popover from '@material-ui/core/Popover';
import reportOptions from '../../services/reportOptions'
import Tooltip from '@material-ui/core/Tooltip';
import { List,
  Toolbar,
  Paper,
  Link,
  Popper,
  Menu,
  MenuList,
  MenuItem,
  InputBase,
  withStyles } from "@material-ui/core";
import billingDetails from "../../services/billingDetails";



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
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  // tooltip .title : {
  //   width: '120px',
  //   top: '100%',
  //   left: '50%', /* Use half of the width (120/2 = 60), to center the tooltip */
  // }
  
  
}));


const ReportComponent = () => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabvalue, setValue] = React.useState(0);
  const [billingTypes, setBillingTypes] = useState([])
  const [allTypes,setAllTypes] = useState([])
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // options
 //Adding Hover
 
 let types=["Billing Details","Booking","POS Sales","Agent","Occupancy","Collection","Guest Report"]
  const fetchBillingTypes = async(index)=>{
   
    
    let temp = await reportOptions.getBillingOptions(types[index]);
    console.log(temp);
    setBillingTypes(temp)
  }
  const handlemouseover=(e)=>{
    e.preventDefault()
    let label= parseInt(e.target.id);
    if(label!==null){
      fetchBillingTypes(label)
    }
    
    
  }

  return (
    <div className={classes.root} style={{backgroundColor:'#D6EAF8',height:"100vh"}}>
      <AppBar position="sticky" color="default" style={{position:"sticky",top:"64px"}}>
        <Tabs
          value={tabvalue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Billing Details"  {...a11yProps(0)}  id={0} onMouseOver={handlemouseover}/>
          <Tab label="Booking" {...a11yProps(1)} id={1} onMouseOver={handlemouseover}/>
          <Tab label="POS Sales" {...a11yProps(2)} id={2} onMouseOver={handlemouseover}/>
          <Tab label="Agent" {...a11yProps(3)}  id={3} onMouseOver={handlemouseover} />
          <Tab label="Occupancy" {...a11yProps(4)} id={4}  onMouseOver={handlemouseover}/>
          <Tab label="Collection Report" {...a11yProps(5)}  id={5}  onMouseOver={handlemouseover}/>
          <Tab label="Guest Details" {...a11yProps(6)}  id={6} onMouseOver={handlemouseover}/>
          
        </Tabs>

      </AppBar>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={0}>
        <BillingDetails/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={1}>
        <BillingTab />
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={2}>
        <PoSSales/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={3}>
        <Agent/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={4}>
        <Occupancy/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={5}>
        <CollectionReport/>
      </TabPanel>
      <TabPanel className={classes.tabDiv} value={tabvalue} index={6}>
       <GuestDetails/>
      </TabPanel>
    </div>
  );
};

export default ReportComponent;




// const styles = theme => {};
// const items = [
//   { pathName: "/test", label: "Billing Details" },
//   { pathName: "/test", label: "Booking " },
//   { pathName: "/test", label: "PoSSales" },
//   { pathName: "/test", label: "Agnet" },
//   { pathName: "/test", label: "Occupancy" },
//   { pathName: "/test", label: "Collection Report" },
//   { pathName: "/test", label: "Guest Details" }
// ];


// const subItems= [
//   [["Billing Summary"],["DUE"],["Paid"],["Bill to Company"],["Cancel BILL"]],
//   [["hi", "hello"]]
// ];

// class AppBarTop extends React.Component {
//   state = {
//     value: 0,
//     open: false,
//     anchorEl: null
//   };

//   handleMenuClick = index => {};

//   handleMenuOpen = (index, event) => {
//     const { currentTarget } = event;
//     this.setState({
//       open: true,
//       anchorEl: currentTarget,
//       value: index
//     });
//   };

//   handleMenuClose = () => {
//     this.setState({
//       open: false,
//       anchorEl: null
//     });
//   };

//   handleInputSearch = () => {};

//   render() {
//     const { classes } = this.props;
//     const { anchorEl, open } = this.state;

//     return (
//       <div
//         className={classes.root}
//         onMouseLeave={this.handleMenuClose.bind(this)}
//       >
//         <AppBar position="static">
//           <Paper className={classes.grow}>
//             <Tabs
//               value={this.state.value}
//               indicatorColor="primary"
//               textColor="primary"
//               centered
//             >
//               {items.map((item, index) => (
//                 <Tab
//                   key={index}
//                   onMouseEnter={this.handleMenuOpen.bind(this, index)}
//                   data-key={index}
//                   classes={{ root: classes.tabItem }}
//                   label={item.label}
//                   aria-owns={open ? "menu-list-grow" : undefined}
//                   aria-haspopup={"true"}
//                 />
//               ))}
//             </Tabs>
//             <Popper open={open} anchorEl={anchorEl} id="menu-list-grow">
//               <Paper>
//                 <MenuList>
//                   {subItems[0].map((item, index) => (
//                     <MenuItem key={index} onClick={this.handleMenuClose}>
//                       {item}
//                     </MenuItem>
//                   ))}
//                 </MenuList>
//               </Paper>
//             </Popper>
//           </Paper>
//         </AppBar>
//       </div>
//     );
//   }
// }

// export default withStyles(styles)(AppBarTop);