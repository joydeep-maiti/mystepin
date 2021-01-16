import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Calendar from "./../Calendar/Calendar";
import Navbar from "./../Navbar/Navbar";
import BookingFormLayout from "../BookingForm/BookingFormLayout";
import BillingFormLayout from "../BillingForm/BillingFormLayout";
import Report from "../Report/Report";
import Taxes from "../Taxes/Taxes";
import POSDialog from "../POS/POSDialog";
import Snackbar from "../../common/Snackbar/Snackbar";
import Dialog from "./../../common/Dialog/Dialog";

import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";
import SnackBarContext from "./../../context/snackBarContext";
import constants from "../../utils/constants";
import utils from "../../utils/utils";
import "./Dashboard.scss";

const Dashboard = props => {
  const [allRooms, setAllRooms] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
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

  useEffect(() => {
    const getRooms = async () => {
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
          {dialog.openFor.taxes && (
            <Taxes onClose={() => handleDialog(dialog.contentOf)} />
          )}
          {dialog.openFor.pos && (
            <POSDialog
              allBookings={allBookings}
              title={posDialogTitle}
              onClose={() => handleDialog(dialog.contentOf)}
              // onSnackbarEvent={handleSnackbarEvent}
            />
          )}
        </Dialog>

        <div className="subContainer">
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
              path="/"
              exact
              render={props => (
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
                />
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
