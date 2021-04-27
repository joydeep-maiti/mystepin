import React, { useState, useEffect, useContext } from "react";
import SnackBarContext from "./../../context/snackBarContext";
import {DialogActions, DialogContent, Button } from "@material-ui/core";
import moment from "moment";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import schemas from "../../utils/joiUtils";

import constants from "../../utils/constants";
import "./Advanced.scss";
import AdvancedList from "./AdvancedList";
import advanceService from "../../services/advanceService";
const { success, error } = constants.snackbarVariants;
const schema = schemas.ADVANCESchema;

const AdvancedForm = ({ allBookings, title, onClose, onSnackbarEvent }) => {

  //Main Data
  const [data, setData] = useState({
    roomNumber: "",
    bookingId: "",
    date: utils.getDate(),
    advanceP:"",
    modeofpayment:"",
    reciptNumber:""
  });
  const [errors, setErrors] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [minDate, setMinDate] = useState(utils.getDate());
  const [advanceData, setAdvanceData] = useState([]);
  const [advance,setAdvance]=useState(null);
  const [advanceDetails, setAdvanceDetails] = useState(null);
  const [guest, setGuest] = useState("");
  const [bookingOptions, setBookingOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [disable] = useState(false);
  const handleSnackbarEvent = useContext(SnackBarContext);
  const [paymentMethod,setPaymentMethod] = useState("")
  const paymentMethodOptions=[
    {label:"Cash",value:"Cash"},
    {label:"Card",value:"Card"},
    {label:"Wallet",value:"Wallet"}
  ]

  const getPaymentOptions = () => {
    return paymentMethodOptions.map(type => {
    return { label: type, value: type};
  });
};
const changePaymentOptions=(event)=>{
  setPaymentMethod(event.target.value);
  setData({
    ...data,modeofpayment:event.target.value
  })
}

  // To get all the booking

  useEffect(() => {
    let ADVDATA = [];
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
        booking.rooms.forEach(room => {
          ADVDATA.push({ room, booking });
        });
      }
    });
    setAdvanceData(ADVDATA);
  }, [allBookings]);
  //Rendering room number
  useEffect(() => {
    const options = advanceData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
    setRoomOptions(options);
  }, [advanceData]);

  //UPDATED Values
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
    const filteredArray = advanceData.filter(
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
    const bookingId = option.value;
    const filteredObj = advanceData.find(
      item => item.booking._id === bookingId
    );
    const minDate = utils.getDate(filteredObj.booking.checkIn);
    setData({ ...data, date: minDate, _id: option.value});
    setGuest(option.label)
    const response = await advanceService.getAdvanceByBookingId(option.value);
    if(response){
      setAdvanceDetails(response)
      setAdvance(response.advance)
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
    const {_id,date,advanceP,modeofpayment,reciptNumber} = data;
    const booking = {
      ...allBookings.find(booking => booking._id === _id)
    };
    if(advance) {
      console.log("Response Advance",advance)
      let _advance =[...advance];
      console.log("_advance",_advance)
       _advance.push({date,advanceP,modeofpayment,reciptNumber})
      const response = await advanceService.updateAdvance({
        ...advanceDetails,
        advance:_advance
      });
      if (response){
        openSnackBar("Updated Successfully", success);
        setAdvance(_advance)
      } 
      else openSnackBar("Error Occurred", error);
    }
     else {
      let _advance = {};
      _advance = [{date, advanceP,modeofpayment,reciptNumber}];
      const advanceDetails = {
        advance:_advance,
        bookingId:booking._id,
        guestName: guest,
        rooms:booking.rooms
      }
      const response = await advanceService.addAdvance(advanceDetails);
      if (response.status === 201){
        openSnackBar("Updated Successfully", success);
        setAdvance(_advance)
        setAdvanceDetails(advanceDetails)
      } 
      else openSnackBar("Error Occurred", error);
    }
   
  };
 
  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    handleSnackbarEvent(snakbarObj);
  };

  const handlePosDelete = async (obj) => {
    let index = advance.findIndex(e => e.date === obj.date)
    let temp = JSON.parse(JSON.stringify(advance))
    temp.splice(index,1)
    // console.log("pos",pos, temp)
    setAdvance(temp)
    // const { _id, date, amount, remarks } = data;
    // const booking = {
    //   ...allBookings.find(booking => booking._id === _id)
    // };
    const _advanceDetails= {
      ...advanceDetails,
      advance:temp
    }
    const response = await advanceService.updateAdvance(_advanceDetails);
    if (response) {
      openSnackBar("Updated Successfully", success);
      setAdvance(temp)
    }
    else openSnackBar("Error Occurred", error);
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
            getInputArgObj( "advanceP", "Advance","text", disable)
          )}
        </div>
        <div className="form-group">
          {FormUtils.renderSelect({
            id: "modeofpayment",
            label: "Mode of Payment",
            name: "modeofpayment",
            value: data.modeofpayment,
            onChange: event => changePaymentOptions(event),
            options: paymentMethodOptions,
            error: errors.modeofpayment,
            disabled: disable
          })}
          {FormUtils.renderInput(
            getInputArgObj( "reciptNumber","Recipt Number", "text", disable)
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
      {advance && <AdvancedList
        advance ={advance}
        booking = {allBookings}
        handlePosDelete={handlePosDelete}
      />}
       
    </form>
  );
};

export default AdvancedForm;
