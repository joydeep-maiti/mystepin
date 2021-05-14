import React, { useState, useEffect } from "react";
import utils from "../../utils/utils";
import roomTypeService from "../../services/roomTypeService";
import Card from "../../common/Card/Card";
import BookingForm from "../BookingForm/BookingForm";
import BookingFormHeader from "./BookingFormHeader";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";
import Joi from "joi-browser";

import moment from 'moment'
import FormUtils from "../../utils/formUtils";
import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import "./BookingFormLayout.scss";
import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";

const schema = schemas.bookingFormSchema;
const checkinSchema = schemas.checkInFormSchema;
const { success, error } = constants.snackbarVariants;
// const roomTypes = [
//   { label: "AC", value: "AC" },
//   { label: "Non AC", value: "Non AC" },
//   { label: "Deluxe", value: "Deluxe" },
//   { label: "Suite", value: "Suite" },
//   { label: "Dormitory", value: "Dormitory" }
// ];

const proofTypes=[
  {label:"Aadhar" ,value:"Aadhar"},
  {label:"Passport" ,value:"Passport"},
  {label:"PAN" ,value:"PAN"},
  {label:"Voter Id" ,value:"Voter Id"},
  {label:"Driving License" ,value:"Driving License"},
  {label:"Others" ,value:"Others"},
];


const BookingFormLayout = ({
  location,
  history,
  selectedRoom,
  selectedBooking,
  selectedDate,
  onSnackbarEvent,
  onCheckOutRedirect
}) => {
  const [data, setData] = useState({
    hotelName: "Hotel Black Rose",
    hotelAddress: "#234 street, Bangalore",
    firstName: "",
    lastName: "",
    address: "",
    nationality:"Indian",
    checkIn: utils.getDate(),
    checkOut: moment().add(1, 'days').toDate(),
    checkedInTime: "",
    checkedOutTime: "",
    nights:1,
    adults: 1,
    children: 0,
    contactNumber: "",
    rooms: [],
    roomCharges: "",
    flatRoomRate:false,
    Idproof:"",
    proofs: "",
    planType:"AP",
    advance: 0,
    bookingDate: null,
    bookedBy: "",
    status: {
      cancel: false,
      checkedIn: false,
      checkedOut: false
    }
  });
  const [errors, setErrors] = useState({});
  const [openDatePickerCheckIn, setOpenDatePickerCheckIn] = useState(false);
  const [openDatePickerCheckOut, setOpenDatePickerCheckOut] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableFileUpload, setEnableFileUpload] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  useEffect(() => {
    const { pathname } = location;
    if (selectedRoom !== null) {
      if (pathname === "/booking/viewBooking") setViewBookingData();
      else if (pathname === "/booking/newBooking") setNewBookingData();
    } else history.replace("/");
    fetchRoomTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(data.bookedBy === "Agent"){
      schema.agent =  Joi.string().required().label("Agent")
      schema.referencenumber =  Joi.number().required().label("Reference number")
      schema.memberNumber = Joi.any()
      let error = {...errors}
      delete error.memberNumber
      setErrors(error)
    }else if (data.bookedBy === "Member"){
      schema.memberNumber = Joi.number().required().label("Membership Number")
      schema.agent = Joi.any()
      schema.referencenumber = Joi.any()
      let error = {...errors}
      delete error.agent
      delete error.referencenumber
      setErrors(error)
    }else {
      schema.agent = Joi.any()
      schema.referencenumber = Joi.any()
      schema.memberNumber = Joi.any()
      let error = {...errors}
      delete error.agent
      delete error.referencenumber
      delete error.memberNumber
      setErrors(error)
    }
  }, [data.bookedBy]);

  const setViewBookingData = async () => {
    const booking = { ...selectedBooking };
    fetchProofId()
    setData(booking);
    setShouldDisable(!isEdit);
    setAvailableRooms(booking.rooms);
    setStartDate(booking.checkIn);
    setEndDate(booking.checkOut);
  };
  

  const fetchRoomTypes = async () => {
    setLoading(true);
    const rooms = await roomTypeService.getRoomsTypes();
    setRoomTypes(rooms);
    setLoading(false);
  };

  const fetchProofId = async()=> {
    const booking = { ...selectedBooking };
    const res = await bookingService.getProofId(selectedBooking._id)
    if(res.status===200){
      console.log("-----res",res.data)
      booking.idProofImage = res.data.idProofImage
    }
    setData(booking)
  }

  const setNewBookingData = async () => {
    const newData = { ...data };
    const { roomNumber, roomType, _id } = selectedRoom;
    const room = { roomNumber, roomType, _id };
    newData.rooms.push(room);
    newData.checkIn = selectedDate;
    newData.checkOut = moment().add(1, 'days').toDate();

    const availableRooms = await getAvailableRooms(
      newData.checkIn,
      newData.checkOut
    );
    setData(newData);
    setAvailableRooms(availableRooms);
  };

  const getAvailableRooms = async (checkIn, checkOut, bookingId) => {
    return await roomService.getAvailableRooms(checkIn, checkOut, bookingId);
  };

  const getUpdatedRooms = (availableRooms, rooms) => {
    const roomsIndex = getIndexesToRemoveRoomsFromState(availableRooms, rooms);
    roomsIndex.forEach(index => {
      rooms[index] = availableRooms.find(
        r => r.roomType === rooms[index].roomType
      );
    });

    return rooms;
  };

  const getIndexesToRemoveRoomsFromState = (availableRooms, rooms) => {
    const roomsIndex = [];
    const r = rooms.filter(room => {
      let a = availableRooms.findIndex(
        availableRoom => availableRoom.roomNumber === room.roomNumber
      );
      return a === -1 ? room : null;
    });

    r.forEach(currentRoom => {
      const index = rooms.findIndex(
        room => room.roomNumber === currentRoom.roomNumber
      );
      roomsIndex.push(index);
    });

    return roomsIndex;
  };

  const createBooking = async bookingData => {
    if(bookingData["checkIn"] > bookingData["checkOut"]){
      alert("Checkout Date should be greater than Checkin Date!")
      setLoading(false);
      return
    }
    const { status } = await bookingService.addBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar("Booking Successfull", success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const updateBooking = async (
    bookingData,
    message = "Booking Updated Successfully"
  ) => {
    if(bookingData["checkIn"] > bookingData["checkOut"]){
      alert("Checkout Date should be greater than Checkin Date!")
      setLoading(false);
      return
    }
    const { status } = await bookingService.updateBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar(message, success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const checkForErrors = (_schema) => {
    let errors = FormUtils.validate(data, _schema);
    console.log("errors",errors)
    errors = errors || {};
    setErrors(errors);
    return Object.keys(errors).length;
  };

  const openSnackBar = (message, variant, redirectTo) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    onSnackbarEvent(snakbarObj);
    redirectTo && history.push(redirectTo);
  };

  const handleInputChange = ({ currentTarget: input }) => {
    console.log("input",input)
    if(input.name==="contactNumber"){
      console.log("input.value",input.value)
      input.value = input.value.slice(0,10)
    }
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      isCheckingIn?checkinSchema:schema
    );
    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleFlatRateChange = (event) => {
    setData({
      ...data,
      flatRoomRate:event.target.checked
    })
  };

  const handleDatePickerChange = async (event, id) => {
    // debugger
    if(id === "checkIn")
      setOpenDatePickerCheckIn(false)
    else
      setOpenDatePickerCheckOut(false)
    const updatedData = { ...data };
    let updatedRooms = [...updatedData.rooms];
    updatedData[id] = utils.getDate(event);
    if(updatedData["checkIn"] > updatedData["checkOut"]){
      setData(updatedData);
      return
    }
    let duration = new Date(updatedData["checkOut"]).getTime() - new Date(updatedData["checkIn"]).getTime();
    console.log("days",moment.duration(duration).days())
    console.log("asDays",moment.duration(duration).asDays())
    let durationInDays = moment.duration(duration).days()+1;
    const dates = daysBetweenDates(updatedData["checkIn"],updatedData["checkOut"])
    updatedData.nights = dates.length>0?dates.length:1
    if (id === "checkIn") data["checkOut"] = data[id];

    let availableRooms = await getAvailableRooms(
      updatedData.checkIn,
      updatedData.checkOut,
      updatedData._id
    );

    if (
      utils.getFormattedDate(updatedData.checkIn) ===
        utils.getFormattedDate(startDate) &&
      utils.getFormattedDate(updatedData.checkOut) ===
        utils.getFormattedDate(endDate)
    ) {
      availableRooms = [...availableRooms, ...selectedBooking.rooms];
    }

    updatedData.rooms = getUpdatedRooms(availableRooms, updatedRooms);

    setTimeout(() => {
      setData(updatedData);
      setAvailableRooms(availableRooms);
      // setOpenDatePicker(newOpenDatePicker);
    });
  };

  const daysBetweenDates = (startDate, endDate) => {
    let dates = [];
    const currDate = moment(startDate).startOf("day");
    //console.log(currDate)
    const lastDate = moment(endDate).startOf("day");
    //console.log("lastDate",currDate,lastDate)
    while (currDate.add(1, "days").diff(lastDate) < 0) {
      dates.push(currDate.clone().toDate());
    }

    dates.unshift(moment(startDate).toDate());
    // dates.push(moment(endDate).toDate());
    console.log(dates)

    return dates;
  }

  const handleDatePicker = id => {
    return
    // setOpenDatePicker({ ...openDatePicker, [id]: true });
    if(id === "checkIn")
      setOpenDatePickerCheckIn(true)
    else
      setOpenDatePickerCheckOut(true)
  };

  const handleSelectChange = async (event, index) => {
    // debugger
    let newErrors = { ...errors };
    if (newErrors.rooms)
      newErrors.rooms = newErrors.rooms.filter(error => error.index !== index);

    const { name, value } = event.target;
    const rooms = [...data.rooms];
    let room = {};

    let availableRooms = await getAvailableRooms(
      data.checkIn,
      data.checkOut,
      data._id
    );

    if (
      utils.getFormattedDate(data.checkIn) ===
        utils.getFormattedDate(startDate) &&
      utils.getFormattedDate(data.checkOut) ===
        utils.getFormattedDate(endDate)
    ) {
      availableRooms = [...availableRooms, ...selectedBooking.rooms];
    }

    setAvailableRooms(availableRooms)

    if (name === "roomType")
      room = availableRooms.find(room => room.roomType === value);
    else if (name === "roomNumber")
      room = availableRooms.find(room => room.roomNumber === value);

    rooms[index] = {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      _id: room._id
    };
    setData({ ...data, rooms });
    setErrors(newErrors);
  };

  const handleSelectChange1=(event,index)=>{
    let newErrors = { ...errors };
    console.log("event",event.currentTarget);
    if(event.target.name === "planType"){
      console.log(event.target.value);
      setData({...data, planType:event.target.value})
    }else {

      const updatedState = FormUtils.handleInputChange(
        {
          name:event.target.name,
          value:event.target.value
        },
        data,
        errors,
        isCheckingIn?checkinSchema:schema
      );
      setData(updatedState.data);
      newErrors= updatedState.errors
    }
    setErrors(newErrors);
   }

  const handleFormSubmit = event => {
    event.preventDefault();
    const errors = checkForErrors(schema);
    if (errors) return;

    setLoading(true);
    let bookingData = {
      ...data,
      balance: data.roomCharges - data.advance
    };
    if (!isEdit) {
      bookingData["bookingDate"] = utils.getDate();
      console.log(bookingData);
      createBooking(bookingData);
    } else {
      updateBooking(bookingData);
    }
  };

  const handleAddRoom = () => {
    const rooms = [...data.rooms];
    rooms.push({
      roomNumber: "",
      roomType: "",
      _id: ""
    });
    setData({ ...data, rooms });
  };

  const handleDeleteRoom = index => {
    let newErrors = { ...errors };
    if (newErrors.rooms)
      newErrors.rooms = newErrors.rooms.filter(error => error.index !== index);
    if (newErrors.rooms && newErrors.rooms.length === 0) delete newErrors.rooms;

    let rooms = [...data.rooms];
    rooms = rooms.filter((room, i) => i !== index);
    setData({ ...data, rooms });
    setErrors(newErrors);
  };

  const handleBack = () => {
    history.push("/");
  };

  const handleEdit = () => {
    setIsEdit(true);
    setShouldDisable(false);
  };

  const handleCancel = () => {
    const updatedData = { ...data };
    updatedData.status = { ...updatedData.status, cancel: true };
    setData(updatedData);
    setLoading(true);
    updateBooking(updatedData, "Booking Cancelled Successfully");
  };

  const handleCheckIn = () => {
    setIsCheckingIn(true)
    const errors = checkForErrors(checkinSchema);
    if (errors) {
      handleEdit()
      return;
    }

    //To check the id proof for sign in changed

    // if(!data.idProofImage){
    //   alert("Please Upload Id Proof first in order to check in")
    //   setEnableFileUpload(true)
    //   return
    // }
    const updatedData = { ...data };
    updatedData.checkedInTime = utils.getTime();
    updatedData.status = { ...updatedData.status, checkedIn: true };
    setData(updatedData);
    setLoading(true);
    if(!updatedData._id){
      createBooking(updatedData)
    }else {
      updateBooking(updatedData, "Checked In Successfully");
    }
  };

  const handleCheckOut = () => {
    onCheckOutRedirect(data);
  };

  const onChangeHandler = async (event) =>{
      console.log(event.target.files[0])
      let reader = new FileReader();
      reader.onloadend = async function() {
        console.log('RESULT', reader.result)
        const temp = {
          ...data,
          idProofImage: reader.result
        }
        setData(temp)
        // const { status } = await bookingService.testBooking(data)
      }
      if(event.target.files[0]){
        reader.readAsDataURL(event.target.files[0]);
      }
  }

  return (
    <React.Fragment>
      {loading && <LoaderDialog open={loading} />}
      <div className="cardContainer">
        <Card
          header={
            <BookingFormHeader
              status={data.status}
              checkIn={data.checkIn}
              checkOut={data.checkOut}
              isBooked={data.bookingDate}
              onEdit={handleEdit}
              isEdit={isEdit}
              onCancel={handleCancel}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          }
          content={
            <BookingForm
              onDatePickerChange={handleDatePickerChange}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSelectChange1={handleSelectChange1}
              onFormSubmit={handleFormSubmit}
              onAddRoom={handleAddRoom}
              onDeleteRoom={handleDeleteRoom}
              data={data}
              availableRooms={availableRooms}
              errors={errors}
              options={roomTypes}
              options1={proofTypes}
              onSetPrice={(price,roomWiseRatesForBooking) => setData({...data,roomCharges:price,roomWiseRatesForBooking})}
              onFileSelect={onChangeHandler}
              shouldDisable={shouldDisable}
              onBack={handleBack}
              openDatePickerCheckIn={openDatePickerCheckIn}
              openDatePickerCheckOut={openDatePickerCheckOut}
              handleDatePicker={handleDatePicker}
              enableFileUpload={enableFileUpload}
              handleFlatRateChange={handleFlatRateChange}
              updatedata={(val)=>setData({...data,...val})}
              onCheckIn={handleCheckIn}
            />
          }
          maxWidth={700}
          margin="40px auto"
        />
      </div>
    </React.Fragment>
  );
};

export default BookingFormLayout;
