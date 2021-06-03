import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import './Navbar.css'
import BuildIcon from '@material-ui/icons/Build';
import RefreshIcon from '@material-ui/icons/Refresh';
import LocalHotelSharpIcon from '@material-ui/icons/LocalHotelSharp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Menu, MenuItem } from '@material-ui/core';
import { DialogTitle } from "@material-ui/core";
import POSMenu from '../POS/POSMenu'
import TableChartIcon from '@material-ui/icons/TableChart';
import AdvanceMenu from '../AdvancedTab/AdvancedMenu'
import reportService from '../../services/reportService'
import jsPDF from 'jspdf';
import "jspdf-autotable";
import moment from "moment";
import { fetchAndGenerateDailyOccupanyReport } from '../Occupancy/Occupancy'

const useStyles = makeStyles(theme => ({
  stepIn: {
    display: "inline-block",
    cursor: "pointer",
    fontWeight: 'bold'
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
  userData,
  ...props
}) => {
  const classes = useStyles();

  const [userPermissions, setUserPermissions] = React.useState([]);

  React.useEffect(()=>{
    console.log("props.userData per",userData)
    if(userData){
      setUserPermissions(userData.permissions)
    }
  },[userData])

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className="nav-style">
          < LocalHotelSharpIcon style={{ paddingRight: "10px", fontSize: "45px" }} />
          <Typography variant="h6" className={classes.title}>
            <div onClick={onRedirectFromNavbar} className={classes.stepIn}>
              StepInn
            </div>
          </Typography>

          <Button
            className="button-bg"
            color="inherit"
            onClick={() => fetchAndGenerateDailyOccupanyReport()}
          >
            <TableChartIcon />
            Occupancy Chart
          </Button>
         { userPermissions.includes("Utility") && <React.Fragment>
            <AdvanceMenu showAdvancedDialog={showAdvancedDialog} />
          </React.Fragment>}

          <Button
            className="button-bg"
            color="inherit"
            onClick={() => props.history.push("/config")}
          >
            <BuildIcon />
            Configuration
          </Button>
          <Button
            className="button-bg"
            color="inherit"
            onClick={() => props.history.push("/reports")}
          >
            <AssessmentIcon />
            Reports
          </Button>
          {path === "/" && (
            <React.Fragment>
              {userPermissions.includes("POS") && <POSMenu showPOSDialog={showPOSDialog} />}
              <Button color="inherit" onClick={onRefresh}>
                <RefreshIcon />
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