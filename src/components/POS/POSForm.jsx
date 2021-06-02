import React, { useState, useEffect, useContext } from "react";
import SnackBarContext from "./../../context/snackBarContext";
import { DialogTitle,DialogActions, DialogContent, Button } from "@material-ui/core";
import moment from "moment";

import POSList from "./POSList";
import bookingService from "../../services/bookingService";
import posService from "../../services/posService";
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
  const [pos, setPos] = useState(null);
  const [posDetails, setPosDetails] = useState(null);
  const [guest, setGuest] = useState("");
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
      let { checkIn, checkOut, months } = booking;
      if (months.length > 1) {
        const updatedValue = getUpdatedValues(booking, utils.getDateObj(new Date()));
        checkIn = updatedValue.checkIn;
        checkOut = updatedValue.checkOut;
      }
      const dates = utils.daysBetweenDates(checkIn, checkOut);
      const today = dates.find(el => moment(el).isSame(new Date(), 'day'))
      if (today) {
        // console.log("setOccupiedRooms", booking)
        booking.rooms.forEach(room => {
          POSData.push({ room, booking });
        });
      }
      // booking.rooms.forEach(room => {
      //   POSData.push({ room, booking });
      // });
    });
    setPosData(POSData);
  }, [allBookings]);

  useEffect(() => {
    // console.log("posData",posData)
    const options = posData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
    setRoomOptions(options);
  }, [posData]);

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
    console.log("filteredArray",filteredArray)
    const options = filteredArray.map(item => ({
      label: `${item.booking.firstName} ${item.booking.lastName}`,
      value: item.booking._id
    }));
    console.log("options",options)

    setBookingOptions(options);
    setBookingId(options[0])
    setData({ ...data, roomNumber: roomNo, _id: options[0].value });
    setErrors(updatedErrors);
  };

  const setBookingId = async(option) => {
    // let updatedErrors = { ...errors };
    // delete updatedErrors[input.name];
    const bookingId = option.value;
    const filteredObj = posData.find(
      item => item.booking._id === bookingId
    );
    const minDate = utils.getDate(filteredObj.booking.checkIn);
    setData({ ...data, date: minDate, _id: option.value});
    setGuest(option.label)
    const response = await posService.getPosByBookingId(option.value);
     console.log("posgetresponse",response)
    if(response){
      setPosDetails(response)
      setPos(response.pos)
    }
    console.log("bookingId",data)
    setMinDate(minDate);
    // setErrors(updatedErrors);
  };

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
    errors = errors || {};
    console.log("errors, data",data,errors)
    setErrors(errors);
    return Object.keys(errors).length;
  };

  const onFormSubmit = async event => {
    event.preventDefault();
    // console.log("in")
    const errors = checkForErrors();
    if (errors) return;

    const { _id, date, amount, remarks } = data;
    const booking = {
      ...allBookings.find(booking => booking._id === _id)
    };

    if (pos) {
      let _pos = { ...pos };
      _pos[title] = _pos[title]
        ? [..._pos[title], { date, amount, remarks }]
        : [{ date, amount, remarks }];
      // booking.pos = _pos;
      const response = await posService.updatePos({
        ...posDetails,
        pos:_pos
      });
      if (response){
        openSnackBar("Updated Successfully", success);
        setPos(_pos)
      } 
      else openSnackBar("Error Occurred", error);
    } else {
      let _pos = {};
      _pos[title] = [{ date, amount, remarks }];
      const _posDetails = {
        pos:_pos,
        bookingId:booking._id,
        guestName: guest,
        rooms:booking.rooms
      }
      const response = await posService.addPos(_posDetails);
      if (response.status === 201){
        openSnackBar("Updated Successfully", success);
        setPos(_pos)
        setPosDetails(_posDetails)
      } 
      else openSnackBar("Error Occurred", error);
    }

    // const response = await bookingService.updateBooking(booking);
    // if (response.status === 200){
    //   openSnackBar("Updated Successfully", success);
    //   setPos(booking.pos)
    // } 
    // else openSnackBar("Error Occurred", error);
    // onClose();
  };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    handleSnackbarEvent(snakbarObj);
  };

  const handlePosDelete = async (obj) => {
    let index = pos[title].findIndex(e => e.date === obj.date)
    let temp = JSON.parse(JSON.stringify(pos))
    temp[title].splice(index,1)
    // console.log("pos",pos, temp)
    setPos(temp)
    // const { _id, date, amount, remarks } = data;
    // const booking = {
    //   ...allBookings.find(booking => booking._id === _id)
    // };
    const _posDetails = {
      ...posDetails,
      pos:temp
    }
    const response = await posService.updatePos(_posDetails);
    if (response) {
      openSnackBar("Updated Successfully", success);
      setPos(temp)
    }
    else openSnackBar("Error Occurred", error);
    // onClose();
  };


  const handleKot=()=>{
    // if(data.roomNumber === null){
    //   openSnackBar("Select Room Number", error);
    // }

  }

  return (
    <> 
    <div className="kot">
         <Button onClick={handleKot()}>KOT</Button>
        </div>
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
          {/* {FormUtils.renderInput({
            id: "bookingId",
            label: "Booking Id",
            name: "bookingId",
            value: data._id,
            // onChange: event => setBookingId(event),
            // options: bookingOptions,
            error: errors.bookingId,
            disabled: true
          })} */}
          {FormUtils.renderInput({
            id:"bookingId",
            label:"Guest Name",
            name: "bookingId",
            type:"text",
            value:guest,
            // onChange: event => handleInputChange(event, id),
            error: errors["id"],
            disabled: true
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
      <DialogActions style={{paddingRight:"2rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button onClick={onFormSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
      {pos && <POSList 
        pos={pos[title]}
        title={title}
        handlePosDelete={handlePosDelete}
        />}
    </form>
    </>
  );
};

export default POSForm;
