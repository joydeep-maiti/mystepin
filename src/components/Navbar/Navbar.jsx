import React,{useState}from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import './Navbar.css'
import BuildIcon from '@material-ui/icons/Build';
import RefreshIcon from '@material-ui/icons/Refresh';
import LocalHotelSharpIcon from '@material-ui/icons/LocalHotelSharp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import {Menu,MenuItem } from '@material-ui/core';
import { DialogTitle } from "@material-ui/core";
import POSMenu from '../POS/POSMenu'
import AdvanceMenu from '../AdvancedTab/AdvancedMenu'
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
  showAdvancedDialog,
  showPOSDialog,
  ...props
}) => {
  const classes = useStyles();
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
          
              <React.Fragment>
                <AdvanceMenu showAdvancedDialog={showAdvancedDialog}  />
              </React.Fragment>
      
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