import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import moment from "moment";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import Calendar from "./../Calendar/Calendar";
import Navbar from "./../Navbar/Navbar";
import BookingFormLayout from "../BookingForm/BookingFormLayout";
import BillingFormLayout from "../BillingForm/BillingFormLayout";
import Report from "../Report/Report";
import Taxes from "../Taxes/Taxes";
import Configuration from "../Configuration/Configuration";
import POSDialog from "../POS/POSDialog";
import Snackbar from "../../common/Snackbar/Snackbar";
import Dialog from "./../../common/Dialog/Dialog";

import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";
import SnackBarContext from "./../../context/snackBarContext";
import constants from "../../utils/constants";
import utils from "../../utils/utils";
import "./Dashboard.scss";

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: "20px",
    minWidth: 200,
    display: "flex"
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectDiv: {
    display: "flex",
    justifyContent: "space-between",
    width: "65%",
    marginLeft: "auto",
    marginRight: "50px"

  }
}));

const Dashboard = props => {
  const [allRooms, setAllRooms] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [occupiedRooms, setOccupiedRooms] = useState([]);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [currentDateObj, setCurrentDateObj] = useState(
    utils.getDateObj(utils.getDate())
  );

  const [posDialogTitle, setPosDialogTitle] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    contentOf: "",
    size: "sm",
    openFor: {
      taxes: false,
      pos: false
    }
  });

  const [snackbarObj, setSnackbarObj] = useState({
    open: false,
    message: "",
    variant: constants.snackbarVariants.success,
    resetBookings: false
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = React.useState('day');

  const handleViewChange = (event) => {
    setView(event.target.value);
    setCurrentDateObj(utils.getDateObj(utils.getDate()));
    setCurrentDate(utils.getDate());
  };
  const classes = useStyles();

  useEffect(() => {
    const getRooms = async () => {
      // debugger
      const allRooms = await roomService.getRooms();
      allRooms.length > 0 && setAllRooms(allRooms);
    };

    getRooms();
  }, []);

  const setBookings = async dateObj => {
    const allBookings = await bookingService.getBookings(dateObj);
    if (allBookings.length > 0) {
      setAllBookings(allBookings);
    }
    setLoading(false);
  };

  useEffect(() => {

    let rooms = [];
    let bookedRooms = [];
    const filteredBookings = allBookings.filter(
      booking => booking.status.checkedIn && !booking.status.checkedOut
    );
    filteredBookings.forEach(booking => {
      // debugger
      if (view === "day") {
        const dates = utils.daysBetweenDates(booking.checkIn, booking.checkOut);
        const today = dates.find(el => moment(el).isSame(currentDate, 'day'))
        if (today) {
          booking.rooms.forEach(room => {
            rooms.push({ room, booking });
          });
        }
      } else {
        booking.rooms.forEach(room => {
          rooms.push({ room, booking });
        });
      }
    });

    allBookings.forEach(booking => {
      // debugger
      if (view === "day") {
        const dates = utils.daysBetweenDates(booking.checkIn, booking.checkOut);
        const today = dates.find(el => moment(el).isSame(currentDate, 'day'))
        // const today = moment(currentDate).isBetween(moment(booking.checkIn).subtract(1, 'd'), moment(booking.checkOut));
        if (today) {
          booking.rooms.forEach(room => {
            bookedRooms.push({ room, booking });
          });
        }
      } else {
        booking.rooms.forEach(room => {
          bookedRooms.push({ room, booking });
        });
      }
    });

    setOccupiedRooms(rooms);
    setBookedRooms(bookedRooms);
  }, [allBookings]);

  const handleDateChange = (date) => {
    // console.log("mmd",moment(date).toDate())
    setView('day')
    setCurrentDateObj(utils.getDateObj(utils.getDate(date)));
    setCurrentDate(utils.getDate(date));
  };

  const setDateObj = (dateObj, date) => {
    setCurrentDateObj(dateObj);
    setCurrentDate(date);
  };

  const handleLoading = value => {
    setLoading(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setBookings(currentDateObj);
  };

  const handleShowTaxes = () => {
    handleDialog("taxes");
  };

  const handleDialog = (showFor, size) => {
    const newDialogObj = { ...dialog };
    const openFor = { ...newDialogObj.openFor };
    openFor[showFor] = !openFor[showFor];
    newDialogObj.open = !newDialogObj.open;
    newDialogObj.contentOf = showFor;
    newDialogObj.size = size || "sm";
    newDialogObj.openFor = openFor;
    setDialog(newDialogObj);
  };

  const handleShowPOSDialog = title => {
    setPosDialogTitle(title);
    handleDialog("pos");
  };

  const handleRedirectFromNavbar = () => {
    props.history.replace("/");
  };

  const handleSnackbarEvent = snackbarObj => {
    setSnackbarObj(snackbarObj);
    setLoading(true);
    snackbarObj.resetBookings && setBookings(currentDateObj);
  };

  const handleSnackBar = () => {
    const newSnackbarObj = { ...snackbarObj };
    newSnackbarObj.open = false;

    setSnackbarObj(newSnackbarObj);
  };

  const handleCheckOutRedirect = bookingObj => {
    const selectedBooking = bookingObj && { ...bookingObj };
    setSelectedBooking(selectedBooking);
    props.history.push("/billing");
  };

  const handleRedirectFromBilling = bookingObj => {
    const selectedBooking = bookingObj && { ...bookingObj };
    setSelectedBooking(selectedBooking);
    props.history.push("/report");
  };

  const handleFormRedirect = (bookingObj, roomObj, selectedDate) => {
    const selectedBooking = bookingObj && { ...bookingObj };
    const selectedRoom = { ...roomObj };
    setSelectedBooking(selectedBooking);
    setSelectedRoom(selectedRoom);
    setSelectedDate(selectedDate);

    if (bookingObj) {
      if (bookingObj.status.checkedOut) props.history.push("/report");
      else props.history.push("/booking/viewBooking");
    } else props.history.push("/booking/newBooking");
  };

  return (
    <SnackBarContext.Provider value={handleSnackbarEvent}>
      <div className="mainContainer">
        <Snackbar
          open={snackbarObj.open}
          message={snackbarObj.message}
          onClose={handleSnackBar}
          variant={snackbarObj.variant}
        />
        <Navbar
          onRefresh={handleRefresh}
          showTaxes={handleShowTaxes}
          showPOSDialog={handleShowPOSDialog}
          path={props.location.pathname}
          onRedirectFromNavbar={handleRedirectFromNavbar}
        />
        <Dialog
          open={dialog.open}
          onClose={() => handleDialog(dialog.contentOf)}
          size={dialog.size}
        >
          {/* {dialog.openFor.taxes && (
            <Taxes onClose={() => handleDialog(dialog.contentOf)} />
          )} */}
          {dialog.openFor.pos && (
            <POSDialog
              allBookings={allBookings}
              title={posDialogTitle}
              onClose={() => handleDialog(dialog.contentOf)}
            // onSnackbarEvent={handleSnackbarEvent}
            />
          )}
        </Dialog>

        <div className="subContainer"  >
          <Switch>
            <Route
              path={["/booking/newBooking", "/booking/viewBooking"]}
              render={props => (
                <BookingFormLayout
                  onSnackbarEvent={handleSnackbarEvent}
                  selectedBooking={selectedBooking}
                  selectedRoom={selectedRoom}
                  selectedDate={selectedDate}
                  onCheckOutRedirect={handleCheckOutRedirect}
                  {...props}
                />
              )}
            />
            <Route
              path="/billing"
              render={props => (
                <BillingFormLayout
                  onSnackbarEvent={handleSnackbarEvent}
                  selectedBooking={selectedBooking}
                  onRedirectFromBilling={handleRedirectFromBilling}
                  {...props}
                />
              )}
            />
            <Route
              path="/report"
              render={props => (
                <Report selectedBooking={selectedBooking} {...props} />
              )}
            />
            <Route
              path="/config"
              component={Configuration}
            />
            <Route
              path="/"
              exact
              render={props => (
                <>
                  <div style={{ backgroundColor: '#F3DB6F' }}>
                    <div className={classes.selectDiv} >
                      {/* <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">View</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={view}
                        onChange={handleViewChange}
                      >
                        <MenuItem value="day">Day</MenuItem>
                        <MenuItem value="month">Month</MenuItem>
                      </Select>
                    </FormControl> */}
                      <FormControl component="fieldset" className={classes.formControl}>
                        {/* <FormLabel component="legend">View</FormLabel> */}
                        <RadioGroup aria-label="view" style={{ flexDirection: "row" }} name="view" value={view} onChange={handleViewChange}>
                          <FormControlLabel value="day" control={<Radio />} label="Day View" />
                          <FormControlLabel value="month" control={<Radio />} label="Month view" />
                          <MuiPickersUtilsProvider utils={DateFnsUtils} style={{ marginLeft: "1rem" }}>
                            <KeyboardDatePicker
                              disableToolbar
                              format="MM/dd/yyyy"
                              margin="normal"
                              id="date-picker-dialog"
                              label="Date picker inline"
                              value={currentDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                              style={{ marginLeft: "0.5rem" }}
                            />
                          </MuiPickersUtilsProvider>
                        </RadioGroup>
                      </FormControl>
                      <h4 style={{ marginTop: "40px", paddingRight: "20px" }}>{`Occupied Rooms : ${occupiedRooms.length},  Booked Rooms : ${bookedRooms.length}`}</h4>
                    </div>
                  </div>
                  <Calendar
                    allRooms={allRooms}
                    currentDate={currentDate}
                    currentDateObj={currentDateObj}
                    onFormRedirect={handleFormRedirect}
                    allBookings={allBookings}
                    loading={loading}
                    onLoading={handleLoading}
                    setBookings={setBookings}
                    setDateObj={setDateObj}
                    {...props}
                    view={view}
                  />
                </>
              )}
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </SnackBarContext.Provider>
  );
};

export default Dashboard;
