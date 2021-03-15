import React from "react";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Tooltip
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import HotelIcon from "@material-ui/icons/Hotel";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";

import useStyles from "./BookingFormStyle";

const BookingFormHeader = props => {
  const classes = useStyles();
  const {
    onEdit,
    onCancel,
    onCheckIn,
    onCheckOut,
    status,
    checkIn,
    checkOut
  } = props;

  return (
    <div className={classes.formHeader}>
      <AppBar position="static">
        <Toolbar variant="dense" style={{background:"#0088bc"}}>
          <Typography variant="h6" className={classes.formTitle} >
            Booking
          </Typography>
          <Tooltip title="Edit">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={onEdit}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {!status.checkedIn && (
            <Tooltip title="Cancel">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={onCancel}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {!status.checkedIn && moment().toDate() >= moment(checkIn).toDate() && (
            <Tooltip title="Check In">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={onCheckIn}
              >
                <HotelIcon/>
              </IconButton>
            </Tooltip>
          )}
          {status.checkedIn && moment().toDate() >= moment(checkOut).toDate() && (
            <Tooltip title="Check Out">
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={onCheckOut}
              >
                <MeetingRoomIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default BookingFormHeader;
