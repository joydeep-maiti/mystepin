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
import reportOptions from '../../services/reportOptions'
import Popover from "@material-ui/core/Popover";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
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
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    textTransform: "none"
  }
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
  // const [state,setState] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const [popno, setpopno] = useState(-1)
  const [id, setid] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  //  const state = {
  //   value: 0,
  //   anchorEl: null,
  //   popno: -1
  // };

  // const handlePopoverClose = () => {
  //   this.setState({ anchorEl: null, popno: -1 });
  // };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    //setpopno(-1);
  };

  const handleEvent = (e, _popno) => {
    setAnchorEl( e.currentTarget);
     setpopno(_popno );
  };

  // const handleChange = (event, value) => {
  //  setvalue( value );
  // };
 //const  classes = this.props;
  //const  value  = state[0];
  // options
 //Adding Hover
 
 let types=["Billing Details","Booking","POS Sales","Agent","Occupancy","Collection","Guest Report"]
  const fetchBillingTypes = async(index)=>{
    
    let temp = await reportOptions.getBillingOptions(types[index]);
    console.log(temp)
    setBillingTypes(temp)
  }
  const handlemouseover=(e,event,name)=>{ 
    e.preventDefault()
    let label= parseInt(e.target.name);
    if(label!==null){
      fetchBillingTypes(label)

    }
    setid(id);
  }
  
  
  return (
    <div className={classes.root} style={{backgroundColor:'#D6EAF8',height:"100vh"}}>
      {/* <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onMouseOver={handleClose}
      ></Menu> */}
      <AppBar position="sticky" color="default" style={{position:"sticky",top:"64px"}}>
        <Tabs
          value={tabvalue}
          onChange={handleChange}
          onMouseOver={handlemouseover}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          id={id}
        >
       
          <Tab label="Billing Details"  {...a11yProps(0)}  name={0} onMouseOver={e => handleEvent(e, 1)}  />
          <Tab label="Booking" {...a11yProps(1)} name={1} onMouseOver={e => handleEvent(e, 1)}/>
          <Tab label="POS Sales" {...a11yProps(2)} name={2} onMouseOver={e => handleEvent(e, 1)}/>
          <Tab label="Agent" {...a11yProps(3)}  name={3}  onMouseOver={e => handleEvent(e, 1)}/>
          <Tab label="Occupancy" {...a11yProps(4)} name={4}  onMouseOver={e => handleEvent(e, 1)}/>
          <Tab label="Collection Report" {...a11yProps(5)}  name={5}  onMouseOver={e => handleEvent(e, 1)}/>
          <Tab label="Guest Details" {...a11yProps(6)}  name={6} onMouseOver={e => handleEvent(e, 1)}/>
        </Tabs>
        <Popover
            id="menu2Popover"
            open={anchorEl !=null}
            onClose={handlePopoverClose}
            anchorEl={anchorEl}
          >
            {popno === 1 && (
              <MenuList>
                <MenuItem>{billingTypes[0]}</MenuItem>
                <MenuItem>{billingTypes[1]}</MenuItem>
                <MenuItem>{billingTypes[2]}</MenuItem>
                <MenuItem>{billingTypes[3]}</MenuItem>
                <MenuItem>{billingTypes[4]}</MenuItem>
                <MenuItem>{billingTypes[5]}</MenuItem>
                <MenuItem>{billingTypes[6]}</MenuItem>
                <MenuItem>{billingTypes[7]}</MenuItem>
                <MenuItem>{billingTypes[8]}</MenuItem>
                <MenuItem>{billingTypes[9]}</MenuItem>
              </MenuList>
            )}
            {/* {popno === 2 && (
              <MenuList>
                <MenuItem>Tab 2 - Submenu 1</MenuItem>
                <MenuItem>Tab 2 - Submenu 2</MenuItem>
              </MenuList>
            )}
            {popno === 3 && (
              <MenuList>
                <MenuItem>Tab 3 - Submenu 1</MenuItem>
                <MenuItem>Tab 3 - Submenu 2</MenuItem>
              </MenuList>
            )} */}
          </Popover>
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