import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
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
import ReportComponent from '../ReportComponent/ReportComponent'
import AdvancedDialog from '../AdvancedTab/AdvancedDialog'
import RecentCheckouts from '../RecentCheckouts/RecentCheckouts'
import ApproximateBill from '../ApproximateBill/ApproximateBill'
import BillSettlement from '../BillSettlement/BillSettlement'
import GuestSearch from '../GuestSearch/GuestSearch'
import TodayCheckIn from '../TodayCheckIn/TodayCheckIn'
import PrintBill from '../PrintBill/PrintBill'
import CleanRoom from '../CleanRoom/CleanRoom'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
// import constants from "../../utils/constants";

const { success, error } = constants.snackbarVariants;

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
  const [advancedDialogTitle, setAdvancedDialogTitle] = useState("");
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
  const [openCleanRoomDlg, setOpenCleanRoomDlg] = React.useState(false);
  const [roomToClean, setRoomToClean] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  const handleViewChange = (event) => {
    setView(event.target.value);
    setCurrentDateObj(utils.getDateObj(utils.getDate()));
    setCurrentDate(utils.getDate());
  };
  const classes = useStyles();

  useEffect(() => {
    // getRooms();
    console.log("props.userData",props.userData)
    if(!props.userData){
      props.history.push("/login")
      return
    }
    setUserData(props.userData)
  }, []);

  const getRooms = async () => {
    // debugger
    const allRooms = await roomService.getRooms();
    allRooms.length > 0 && setAllRooms(allRooms);
  };
  const setBookings = async dateObj => {
    await getRooms()
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
      let { checkIn, checkOut, months } = booking;
      if (view === "day") {
        if (months.length > 1) {
          const updatedValue = getUpdatedValues(booking, currentDateObj);
          checkIn = updatedValue.checkIn;
          checkOut = updatedValue.checkOut;
        }
        const dates = utils.daysBetweenDates(checkIn, checkOut);
        const today = dates.find(el => moment(el).isSame(currentDate, 'day'))
        if (today) {
          // console.log("setOccupiedRooms", booking)
          booking.rooms.forEach(room => {
            rooms.push({ room, booking });
          });
        }
        // console.log("checkIn, checkOut",checkIn, checkOut,)
      } else {
        booking.rooms.forEach(room => {
          rooms.push({ room, booking });
        });
      }
    });

    const filteredForBookings = allBookings.filter(
      booking => !booking.status.checkedIn
    );

    filteredForBookings.forEach(booking => {
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

    console.log("Occupied Rooms",occupiedRooms)

    setBookedRooms(bookedRooms);
  }, [allBookings]);

  const getUpdatedValues = (booking, dateObj) => {
    let { checkIn, checkOut, months } = booking;
    const { month, year, days } = dateObj;
    const index = months.findIndex(month => month.month === dateObj.month);

    if (index === 0) {
      checkIn = utils.getDate(checkIn);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    } else if (index === months.length - 1) {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = utils.getDate(checkOut);
    } else {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    }

    return { checkIn, checkOut };
  };

  const handleDateChange = (date) => {
    // console.log("mmd",moment(date).toDate())
    setView('day')
    setCurrentDateObj(utils.getDateObj(utils.getDate(date)));
    setCurrentDate(utils.getDate(date));

    console.log(currentDate);
    console.log(currentDateObj);
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
  //Advance
  const handleShowAdvancedDialog = (title, size) => {
    setAdvancedDialogTitle(title);
    handleDialog("advanced", size);
  };
  const handleRedirectFromNavbar = () => {
    props.history.replace("/");
  };

  const handleSnackbarEvent = snackbarObj => {
    setSnackbarObj(snackbarObj);
    snackbarObj.resetBookings && setLoading(true);
    snackbarObj.resetBookings && setBookings(currentDateObj);
    snackbarObj.resetBookings && getRooms();
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
    console.log("handleCleanRoomRedirect", roomObj)
    const selectedBooking = bookingObj && { ...bookingObj };
    const selectedRoom = { ...roomObj };
    setSelectedBooking(selectedBooking);
    setSelectedRoom(selectedRoom);
    setSelectedDate(selectedDate);
    if (roomObj.dirty) {
      handleCleanRoomRedirect(roomObj._id)
      return
    }
    if (bookingObj) {
      if (bookingObj.status.checkedOut && !bookingObj.status.dirty) props.history.push("/report");
      else if (bookingObj.status.checkedOut && bookingObj.status.dirty) setOpenCleanRoomDlg(true);
      else props.history.push("/booking/viewBooking");
    } else props.history.push("/booking/newBooking");
  };
  const handleCleanRoomRedirect = (room) => {
    // props.history.push("/cleanroom");
    console.log("handleCleanRoomRedirect", room)
    setRoomToClean(room)
    setOpenCleanRoomDlg(true)
  };

  const handleBookingView = (bookingObj) => {
    console.log("bookingObj", bookingObj)
    if (bookingObj) {
      setSelectedBooking(bookingObj);
      setSelectedRoom("test")
      setTimeout(() => {
        if (bookingObj.status.checkedOut) props.history.push("/report");
        else props.history.push("/booking/viewBooking");
      }, 1000)
    }
  };

  const cleanRoom = async () => {
    setLoading(true);
    const res = await roomService.cleanRoom({ rooms: [roomToClean] })

    setLoading(false);
    if (res) {
      setOpenCleanRoomDlg(false)
      const snakbarObj = { open: true, message: "Room Cleaned Successfully!", variant: success, resetBookings: false };
      handleSnackbarEvent(snakbarObj)
      setLoading(true);
      setBookings(currentDateObj)
    }
  }
  const handleCleanRoomSubmit = (val) => {
    switch (val) {
      case "close": setOpenCleanRoomDlg(false);
        break;
      case "book": setOpenCleanRoomDlg(false)
        if (selectedBooking) {
          props.history.push("/booking/viewBooking");
        } else props.history.push("/booking/newBooking");
        break;
      case "clean": cleanRoom()
    }
    // if(val){
    //   cleanRoom()
    // }else {
    //   setOpenCleanRoomDlg(false)
    // }
  }

  //Change color with Booking length

  let bookingcolor = bookedRooms.length > 0 ? "#0088bc" : "#444";
  let occupiedcolor = occupiedRooms.length > 0 ? '#a22a52' : "#444";

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
          showAdvancedDialog={handleShowAdvancedDialog}
          path={props.location.pathname}
          onRedirectFromNavbar={handleRedirectFromNavbar}
          userData={userData}
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
          {
            dialog.openFor.advanced && advancedDialogTitle === "Advance Collection" && (
              <AdvancedDialog
                allBookings={allBookings}
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
              // onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Today's Checkout" && (
              <RecentCheckouts
                // allBookings={allBookings}
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
              // onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Today's Checkin" && (
              <TodayCheckIn
                // allBookings={allBookings}
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
                onBookingView={handleBookingView}
              // onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Approximate Bill" && (
              <ApproximateBill
                // allBookings={allBookings}
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
              // onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Bill Settlement" && (
              <BillSettlement
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
                onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Print Bill" && (
              <PrintBill
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
                onSnackbarEvent={handleSnackbarEvent}
              />
            )}
          {
            dialog.openFor.advanced && advancedDialogTitle === "Guest Details" && (
              <GuestSearch
                title={advancedDialogTitle}
                onClose={() => handleDialog(dialog.contentOf)}
                onSnackbarEvent={handleSnackbarEvent}
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
              path="/approximatebill"
              render={props => (
                <BillingFormLayout
                  onSnackbarEvent={handleSnackbarEvent}
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
              render={props => (
                <Configuration
                  onSnackbarEvent={handleSnackbarEvent}
                  userData={userData}
                  {...props}
                />
              )}
            />
            <Route
              path='/reports'
              render={props => (
                <ReportComponent
                  onSnackbarEvent={handleSnackbarEvent}
                  userData={userData}
                  {...props}
                />
              )}
            />

            <Route
              path="/"
              exact
              render={props => (
                <>
                  <div style={{ backgroundColor: '#D6EAF8' }}>
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
                          <FormControlLabel value="day" control={<Radio style={{ color: "#0088bc" }} />} label="Day View" />
                          <FormControlLabel value="week" control={<Radio style={{ color: "#0088bc" }} />} label="Week View" />
                          <FormControlLabel value="month" control={<Radio style={{ color: "#0088bc" }} />} label="Month view" />
                          <MuiPickersUtilsProvider utils={DateFnsUtils}
                            style={{ marginLeft: "1rem" }}>
                            <KeyboardDatePicker
                              disableToolbar
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="date-picker-dialog"
                              label="Select Date"
                              value={currentDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{
                                'aria-label': 'change date',
                              }}
                              style={{ marginLeft: "0.5rem", width: '150px' }}
                            />
                          </MuiPickersUtilsProvider>
                        </RadioGroup>
                      </FormControl>
                      <div style={{ marginRight: "100px" }}>
                        <h4 style={{ marginTop: "40px", color: occupiedcolor }}>{`Occupied Rooms : ${occupiedRooms.length}`}</h4>
                        <h4 style={{ color: bookingcolor }}>{`Booked Rooms : ${bookedRooms.length}`}</h4>
                      </div>
                    </div>
                  </div>
                  <Calendar
                    allRooms={allRooms}
                    currentDate={currentDate}
                    currentDateObj={currentDateObj}
                    onFormRedirect={handleFormRedirect}
                    handleCleanRoomRedirect={(room) => handleCleanRoomRedirect(room)}
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
        <ConfirmDialog
          openDialog={openCleanRoomDlg}
          setOpenDialog={setOpenCleanRoomDlg}
          title="Clean Room or Book Room?"
          message="Click on Clean button to clean the room and Clicl on Book button to proceed with booking."
          handleSubmit={handleCleanRoomSubmit}
          cleanModal={true}
        />
      </div>
    </SnackBarContext.Provider>
  );
};

export default withRouter(Dashboard);
