import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 2
  }
}));
const BookingTab = () => {
    const classes = useStyles();
    return (
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             Booking
            </Typography>
      </div>
    )
}

export default BookingTab
