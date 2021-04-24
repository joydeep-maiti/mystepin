import React,{useState}from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import POSMenu from "../POS/POSMenu";
import { withRouter } from "react-router-dom";
import './Navbar.css'
import BuildIcon from '@material-ui/icons/Build';
import RefreshIcon from '@material-ui/icons/Refresh';
import LocalHotelSharpIcon from '@material-ui/icons/LocalHotelSharp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import UpdateIcon from '@material-ui/icons/Update';
import {Menu,MenuItem } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  stepIn: {
    display: "inline-block",
    cursor: "pointer",
    fontWeight:'bold'
  },
  root: {
    position: "fixed",
    width: "100%",
    zIndex: "1000",
  },
  title: {
    flexGrow: 1
  },
  buttonTaxes: {
    marginRight: 20
  }
}));

const HeaderNavbar = ({
  onRefresh,
  path,
  onRedirectFromNavbar,
  showTaxes,
  showPOSDialog,
  ...props
}) => {
  const classes = useStyles();
  const [state,setState]=useState({open:false, anchorEl:null})
  const handleClick = event => {
    setState({ open: true, anchorEl: event.currentTarget });
  };

 const handleRequestClose = () => {
    setState({ open: false });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className="nav-style">
        < LocalHotelSharpIcon  style={{paddingRight:"10px",fontSize:"45px"}}/>
          <Typography variant="h6" className={classes.title}>             
            <div onClick={onRedirectFromNavbar} className={classes.stepIn}>
              StepInn
            </div>
          </Typography>
          
              
                <Button color="inherit" onClick={onRefresh}
                 aria-owns={state.open ? 'simple-menu' : null}
                 aria-haspopup="true"
                 onClick={handleClick}
                 onMouseOver={handleClick} 
                >
                  <UpdateIcon/>
                  Utility
                </Button>
                <Menu
                autoWidth={false}
          id="simple-menu"
          anchorEl={state.anchorEl}
          open={state.open}
          onClose={handleRequestClose}
          getContentAnchorEl={null}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <MenuItem onClick={handleRequestClose}>Advanced</MenuItem>
          <MenuItem onClick={handleRequestClose}>Recent Checkout</MenuItem>
          <MenuItem onClick={handleRequestClose}>Bill Settlement</MenuItem>
          <MenuItem onClick={handleRequestClose}>Approximate Bill</MenuItem>
          <MenuItem onClick={handleRequestClose}>Petty Cash</MenuItem>
        </Menu>
             
            
          
          <Button
            className="button-bg"
            color="inherit"
            onClick={() => props.history.push("/config")}
          >
            <BuildIcon/>
            Configuration
          </Button>
          <Button
            className="button-bg"
            color="inherit"
            onClick={() => props.history.push("/reports")}
          >
            <AssessmentIcon/>
            Reports
          </Button>
          {path === "/" && (
            <React.Fragment>
              <POSMenu showPOSDialog={showPOSDialog} />
              <Button color="inherit" onClick={onRefresh}>
                <RefreshIcon/>
                Refresh
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(HeaderNavbar);