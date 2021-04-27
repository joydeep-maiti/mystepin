import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Button } from "@material-ui/core";
import UpdateIcon from '@material-ui/icons/Update';
const useStyles = makeStyles(theme => ({
  btnPOS: {
    marginRight: 20
  }
}));
const AdvancedMenu = ({ showAdvancedDialog }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenAdvanceMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAdvanceMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenAdvanceTabMenu = title => {
    showAdvancedDialog(title);
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        aria-controls="pos-menu"
        aria-haspopup="true"
        className={classes.btnPOS}
        color="inherit"
        onMouseOver={event => handleOpenAdvanceMenu(event)}
      >
        <UpdateIcon/>
        Utility
      </Button>
      <Menu
        id="pos-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAdvanceMenu}
       >
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Advance Collection")}>Advanced</MenuItem>
          <MenuItem onClick={()=>handleCloseAdvanceMenu}>Recent Checkout</MenuItem>
          <MenuItem onClick={()=>handleCloseAdvanceMenu}>Bill Settlement</MenuItem>
          <MenuItem onClick={()=>handleCloseAdvanceMenu}>Approximate Bill</MenuItem>
          <MenuItem onClick={()=>handleCloseAdvanceMenu}>Petty Cash</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AdvancedMenu;