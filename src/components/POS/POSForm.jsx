import React, { useState, useEffect, useContext } from "react";
import SnackBarContext from "./../../context/snackBarContext";
import { DialogActions, DialogContent, Button } from "@material-ui/core";

import POSList from "./POSList";
import bookingService from "../../services/bookingService";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import schemas from "../../utils/joiUtils";

import constants from "../../utils/constants";
import "./POS.scss";

const { success, error } = constants.snackbarVariants;
const schema = schemas.POSFormSchema;

const POSForm = ({ allBookings, title, onClose, onSnackbarEvent }) => {
  const [data, setData] = useState({
    roomNumber: "",
    bookingId: "",
    date: utils.getDate(),
    amount: "",
    remarks: ""
  });
  const [errors, setErrors] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [minDate, setMinDate] = useState(utils.getDate());
  const [posData, setPosData] = useState([]);
  const [pos, setPos] = useState({});
  const [bookingOptions, setBookingOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [disable] = useState(false);

  const handleSnackbarEvent = useContext(SnackBarContext);

  useEffect(() => {
    
    let POSData = [];
    const filteredBookings = allBookings.filter(
      booking => booking.status.checkedIn && !booking.status.checkedOut
    );
    filteredBookings.forEach(booking => {
      booking.rooms.forEach(room => {
        POSData.push({ room, booking });
      });
    });
    setPosData(POSData);
  }, [allBookings]);

  useEffect(() => {
    const options = posData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
    setRoomOptions(options);
  }, [posData]);

  const getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
      name: id,
      type,
      value: data[id],
      onChange: event => handleInputChange(event, id),
      error: errors[id],
      disabled: shouldDisable
    };
  };

  const getDateArgObj = (id, label, type, minDate, shouldDisable) => {
    return {
      id,
      label,
      name: id,
      type,
      value: data[id],
      onChange: handleDatePickerChange,
      error: errors[id],
      minDate,
      disabled: shouldDisable,
      open: openDatePicker
    };
  };

  const handleInputChange = (event, id) => {
    const updatedState = FormUtils.handleInputChange(
      event.currentTarget,
      data,
      errors,
      schema
    );
    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleDatePickerChange = event => {
    const posDate = utils.getDate(event);
    setTimeout(() => {
      setData({ ...data, date: posDate });
      setOpenDatePicker(false);
    }, 10);
  };

  const handleDatePicker = () => {
    setOpenDatePicker(true);
  };

  const createBookingOptions = ({ target: input }) => {
    let updatedErrors = { ...errors };
    delete updatedErrors[input.name];

    const roomNo = input.value;
    const filteredArray = posData.filter(
      data => data.room.roomNumber === roomNo
    );
    const options = filteredArray.map(item => ({
      label: `${item.booking.firstName} ${item.booking.lastName}`,
      value: item.booking._id
    }));

    setBookingOptions(options);
    setData({ ...data, roomNumber: roomNo });
    setErrors(updatedErrors);
  };

  const setBookingId = ({ target: input }) => {
    let updatedErrors = { ...errors };
    delete updatedErrors[input.name];

    const bookingId = input.value;
    const filteredObj = posData.find(
      item => item.booking._id === bookingId
    );
    const minDate = utils.getDate(filteredObj.booking.checkIn);

    setData({ ...data, date: minDate, _id: bookingId });
    setPos(filteredObj.booking.pos)
    // console.log("bookingId",bookingId)
    setMinDate(minDate);
    setErrors(updatedErrors);
  };

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
    errors = errors || {};
    setErrors(errors);
    return Object.keys(errors).length;
  };

  const onFormSubmit = async event => {
    event.preventDefault();
    const errors = checkForErrors();
    if (errors) return;

    const { _id, date, amount, remarks } = data;
    const booking = {
      ...allBookings.find(booking => booking._id === _id)
    };

    if (booking.pos) {
      let pos = { ...booking.pos };
      pos[title] = pos[title]
        ? [...pos[title], { date, amount, remarks }]
        : [{ date, amount, remarks }];
      booking.pos = pos;
    } else {
      booking.pos = {};
      booking.pos[title] = [{ date, amount, remarks }];
    }

    const response = await bookingService.updateBooking(booking);
    if (response.status === 200) openSnackBar("Updated Successfully", success);
    else openSnackBar("Error Occurred", error);
    onClose();
  };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: true };
    handleSnackbarEvent(snakbarObj);
  };

  return (
    <form onSubmit={event => onFormSubmit(event)}>
      <DialogContent>
        <div className="form-group">
          {FormUtils.renderSelect({
            id: "roomNumber",
            label: "Room Number",
            name: "roomNumber",
            value: data.roomNumber,
            onChange: event => createBookingOptions(event),
            options: roomOptions,
            error: errors.roomNumber,
            disabled: disable
          })}
          {FormUtils.renderSelect({
            id: "bookingId",
            label: "Booking Id",
            name: "bookingId",
            value: data._id,
            onChange: event => setBookingId(event),
            options: bookingOptions,
            error: errors.bookingId,
            disabled: disable
          })}
        </div>
        <div className="form-group">
          <div style={{ width: "100%" }} onClick={handleDatePicker}>
            {FormUtils.renderDatepicker(
              getDateArgObj("date", "Date", "text", minDate, disable)
            )}
          </div>
          {FormUtils.renderInput(
            getInputArgObj("amount", "Amount", "text", disable)
          )}
        </div>
        <div className="form-group">
          {FormUtils.renderInput(
            getInputArgObj("remarks", "Remarks", "text", disable)
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onFormSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
      <POSList 
        pos={pos[title]}
      />
    </form>
  );
};

export default POSForm;
