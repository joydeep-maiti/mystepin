import React, { useState, useEffect } from "react";
import utils from "../../utils/utils";
import roomTypeService from "../../services/roomTypeService";
import Card from "../../common/Card/Card";
import BookingForm from "../BookingForm/BookingForm";
import BookingFormHeader from "./BookingFormHeader";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";

import moment from 'moment'
import FormUtils from "../../utils/formUtils";
import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import "./BookingFormLayout.scss";
import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";

const schema = schemas.bookingFormSchema;
const { success, error } = constants.snackbarVariants;
// const roomTypes = [
//   { label: "AC", value: "AC" },
//   { label: "Non AC", value: "Non AC" },
//   { label: "Deluxe", value: "Deluxe" },
//   { label: "Suite", value: "Suite" },
//   { label: "Dormitory", value: "Dormitory" }
// ];

const proofType=[
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
    checkIn: utils.getDate(),
    checkOut: utils.getDate(),
    checkedInTime: "",
    checkedOutTime: "",
    nights:0,
    adults: "",
    children: 0,
    contactNumber: "",
    rooms: [],
    roomCharges: "",
    Idproof:"",
    proofs:[proofType],
    planType:"AP",
    advance: "",
    bookingDate: null,
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

  useEffect(() => {
    const { pathname } = location;
    if (selectedRoom !== null) {
      if (pathname === "/booking/viewBooking") setViewBookingData();
      else if (pathname === "/booking/newBooking") setNewBookingData();
    } else history.replace("/");
    fetchRoomTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    newData.checkOut = selectedDate;

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
    const { status } = await bookingService.addBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar("Booking Successfull", success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const updateBooking = async (
    bookingData,
    message = "Booking Updated Successfully"
  ) => {
    const { status } = await bookingService.updateBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar(message, success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
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
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      schema
    );
    setData(updatedState.data);
    setErrors(updatedState.errors);
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
    updatedData.nights = durationInDays
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

  const handleDatePicker = id => {
    return
    // setOpenDatePicker({ ...openDatePicker, [id]: true });
    if(id === "checkIn")
      setOpenDatePickerCheckIn(true)
    else
      setOpenDatePickerCheckOut(true)
  };

  const handleSelectChange = async (event, index) => {
    debugger
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
    console.log("event",event.target.value);
    if(event.target.name === "proofType"){
      if (newErrors.proofs)
        newErrors.proofs = newErrors.proofs.filter(error => error.index !== index);
      console.log(event.target.value);
      const proofs=event.target.value;
      console.log(proofs)
      setData({ ...data, proofs });
      
    }else if(event.target.name === "planType"){
      console.log(event.target.value);
      setData({...data, planType:event.target.value})
    }
    setErrors(newErrors);
    // console.log(newErrors);
    // console.log(proofs);
   }

  const handleFormSubmit = event => {
    event.preventDefault();
    const errors = checkForErrors();
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
    if(!data.idProofImage){
      alert("Please Upload Id Proof first in order to check in")
      setEnableFileUpload(true)
      return
    }
    const updatedData = { ...data };
    updatedData.checkedInTime = utils.getTime();
    updatedData.status = { ...updatedData.status, checkedIn: true };
    setData(updatedData);
    setLoading(true);
    updateBooking(updatedData, "Checked In Successfully");
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
              onEdit={handleEdit}
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
              options1={proofType}
              onSetPrice={(price,roomWiseRatesForBooking) => setData({...data,roomCharges:price,roomWiseRatesForBooking})}
              onFileSelect={onChangeHandler}
              shouldDisable={shouldDisable}
              onBack={handleBack}
              openDatePickerCheckIn={openDatePickerCheckIn}
              openDatePickerCheckOut={openDatePickerCheckOut}
              handleDatePicker={handleDatePicker}
              enableFileUpload={enableFileUpload}
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
