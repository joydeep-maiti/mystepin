import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import POSMenu from "../POS/POSMenu";
import { withRouter } from "react-router-dom";
import './Navbar.css'
const useStyles = makeStyles(theme => ({
  stepIn: {
    display: "inline-block",
    cursor: "pointer"
  },
  root: {
    position: "fixed",
    width: "100%",
    zIndex: "1000"
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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className="bg-color">
          <Typography variant="h6" className={classes.title}>
            <div onClick={onRedirectFromNavbar} className={classes.stepIn}>
              StepInn
            </div>
          </Typography>
          <Button
            className={classes.buttonTaxes}
            color="inherit"
            onClick={() => props.history.push("/config")}
          >
            Configuration
          </Button>
          {path === "/" && (
            <React.Fragment>
              <POSMenu showPOSDialog={showPOSDialog} />
              <Button color="inherit" onClick={onRefresh}>
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
