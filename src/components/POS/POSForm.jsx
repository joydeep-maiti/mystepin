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
//********************* KOT */
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import inventory from '../../services/inventory';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InventoryList from './InventoryList'
import kotService from "../../services/kotService";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
const useStyles = makeStyles(theme => ({
    formGroup: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      paddingRight: 20,
      '& > div': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    inputItems: {
      width: "70%"
    },
    span: {
      color: "#0088bc"
    },
    table: {
      maxWidth:1400,
      maxHeight: "70vh"
    },
    roomsDiv:{
      display: "flex",
      flexFlow: "row wrap",
      alignItems: "flex-start",
      justifyContent: "center"
    }
  }));
const { success, error } = constants.snackbarVariants;
const schema = schemas.POSFormSchema;

const POSForm = ({ allBookings, title, onClose, onSnackbarEvent }) => {
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
//***************** KOT*/
const [open, setOpen] = React.useState(false);
const classes = useStyles();
const [item,setItem] = useState({
      itemName:"",
      itemQuantity: 1,
      itemPrice: Number,
})
const [kot,setKot]=useState(null)
const [view, setView] = useState('manual');
const [foods,setFoods] = useState([])
const [loading, setLoading] = useState(false);
const [initialP,setInitialP]= useState(1)
const [bid,setBid]=useState(null)
useEffect(() => {
  setLoading(true);
      fetchFoods()  
  }, [])
 const fetchFoods = async () => {
     const items = await inventory.getFoodItems();
     if(items){
          setFoods(items);
          setLoading(false);           
     }
 }
 const [data, setData] = useState(
{
  roomNumber: "",
  bookingId: "",
  date: utils.getDate(),
  amount: "",
  remarks: "Manual Entry",
}
);
const [kotId,setKotId]=useState("")
const [kotArray,setKotArray] = useState([])
const [showKot,setShowKot] = useState(true)
useEffect(() => {
 view === "kot" ?setShowKot(false) :setShowKot(true)
}, [view])
const handleKOTOpen = () => {
  setOpen(true);
};
const handleKOTClose = () => {
  setOpen(false);
};
const handleKot=()=>{
  if(data.roomNumber === ""){
    openSnackBar("Room Number is Empty", error);
  }
  else{
    handleKOTOpen()
  }
}
const  handleChange = (value) => {
  setItem({...item,
   itemName:`${value.item} ${value.unit}`,
   itemQuantity:1,
   itemPrice: value.price})
   setInitialP(value.price)
}
const handleQuantityChange=(e)=>{
   let quantity = e.target.value;
   if(quantity<1){
     openSnackBar("Minimum Number is 1", error);
     setItem({...item,itemQuantity:1})
   }
   if(quantity !== null){
     setItem({...item,itemQuantity:quantity,
                      itemPrice: initialP*quantity})
    }
 }
 // *********************************************************
 const handleViewChange = (event) => {
   setView(event.target.value);
};
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
  
//Useeffect
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
   // console.log("filteredArray",filteredArray)
    const options = filteredArray.map(item => ({
      label: `${item.booking.firstName} ${item.booking.lastName}`,
      value: item.booking._id
    }));
    //console.log("options",options)

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
    // console.log("posgetresponse",response)
    if(response){
      setPosDetails(response)
      setPos(response.pos)
    }
    setBid(option.value)
    console.log("bid",option.value)
   // console.log("bookingId",data)
    setMinDate(minDate);
    // setErrors(updatedErrors);
  };

  useEffect(() => {
   fetchKOT()
  }, [bid])
const fetchKOT=async()=>{
  const items = await kotService.getKOTByBookingId(bid);
  if(items){
    console.log("KOT Items",items.kot)
    setKot(items.kot)
  }
}

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
    errors = errors || {};
    console.log("errors, data",data,errors)
    setErrors(errors);
    return Object.keys(errors).length;
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    const errors = checkForErrors();
    if (errors) return;
    const { _id, date, amount, remarks} = data;
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
  };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    handleSnackbarEvent(snakbarObj);
  };

  const handlePosDelete = async (obj) => {
    let index = pos[title].findIndex(e => e.date === obj.date)
    let temp = JSON.parse(JSON.stringify(pos))
    temp[title].splice(index,1)
    setPos(temp)
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

//Api Calls
const getArray = async (bid,inputId) => {
  const array = await kotService.getKOTArray(bid,inputId);
  console.log("array ",array)
  if(array){
    setKotArray(array[0].kot);
    handleKot();
  }

}



//Add first element to KOT
const addFirstElement = async () =>{ 
  const res = await await kotService.addKOT({bookingId:bid,date:data.date,kotArray:kotArray})
  if(res.status === 200){
    openSnackBar("Element added Successfully", success);
    setKotId(res.data.kotId)
    return res.data.kotId;
  }
  else{
    openSnackBar("Error Occurred", error);
  }
}
//Add next Elements
const addNextElement = async () =>{ 
  const res = await kotService.updateKOT({bookingId:bid,kotArray:kotArray});
  if(res.status === 200){
    openSnackBar("Element added Successfully", success);
    setKotId(res.data.kotId)
    return res.data.kotId;
  }
  else{
    openSnackBar("Error Occurred", error);
  }
}
const handleKOTSUBMIT = async (e)=>{
    e.preventDefault();
    handleKOTClose();
    if(kotArray){
    if(kot){
      console.log("Update Method")
      const resId =  await addNextElement();
      setData({...data,kotId:resId})
        handlePOSKOTUpload()
        fetchKOT()
      } 
      else{
        console.log("Post Method")
        const resId = await addFirstElement();
        setData({...data,kotId:resId,remarks:resId})
        handlePOSKOTUpload();
        fetchKOT()
        }
    }
}
const handlePOSKOTUpload = async()=>{ 
    const { _id,date, amount,remarks} = data;
    const booking = {
      ...allBookings.find(booking => booking._id === _id)
    };
    if (pos) {
      let _pos = { ...pos };
      _pos[title] = _pos[title]
        ? [..._pos[title], { kotId,date,amount,remarks }]
        : [{kotId,date,amount,remarks}];
      // booking.pos = _pos;

      console.log("Bef insertion",_pos)
      const response = await posService.updatePos({
        ...posDetails,
        pos:_pos
      });
      if (response){
        openSnackBar("Updated Successfully", success);
        console.log("Update Method pos",pos)
        console.log("Update Method _pos",_pos)
        setPos(_pos)
      } 
      else openSnackBar("Error Occurred", error);
    } else {
      let _pos = {};
      _pos[title] = [{kotId,date,amount,remarks}];
      const _posDetails = {
        pos:_pos,
        bookingId:booking._id,
        guestName: guest,
        rooms:booking.rooms
      }
      console.log("Bef insertion",_pos)
      const response = await posService.addPos(_posDetails);
      if (response.status === 201){
        openSnackBar("Updated Successfully", success);
        console.log("First Insertion pos",pos)
        console.log("First Insertion _pos",_pos)
        setPos(_pos)
        setPosDetails(_posDetails)
      } 
      else openSnackBar("Error Occurred", error);
    }
    setKotArray([])
    }

const handleKOT= async (e)=>{
  e.preventDefault();
  let kottemp = [...kotArray];
  kottemp.push(item);
  setKotArray(kottemp)
  setItem({
    itemName:"",
    itemQuantity: 1,
    itemPrice: Number,
})
  console.log("kotArray",kottemp)
}
////////////////***************** ENd  **********************************/
  return (
    <> 
    <div className="radioButtons">
    <FormControl component="fieldset" >
    <RadioGroup aria-label="view" style={{ flexDirection: "row" }} name="view" value={view} onChange={handleViewChange}>
      <FormControlLabel value="manual" control={<Radio style={{ color: "#0088bc" }} />} label="MANUAL" />
   { title === "Food" && <FormControlLabel value="kot" control={<Radio style={{ color: "#0088bc" }} />} label="KOT" /> }
    { title === "Laundary" &&  <FormControlLabel value="linen" control={<Radio style={{ color: "#0088bc" }} />} label="LENIN" /> }

     {title ==="Food" && <Button onClick={handleKot} disabled={showKot}>KOT</Button> }
     {title ==="Laundary" && <Button disabled={showKot}>LINEN</Button> }
    </RadioGroup>                                           
    </FormControl>
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
     { view === 'manual' &&  
     <>
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
        </>
}
      </DialogContent>
      { view === 'manual' &&  
     <>
      <DialogActions style={{paddingRight:"2rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button onClick={onFormSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
      </>
      }
      {pos && <POSList 
        pos={pos[title]}
        title={title}
        view= {view}
        bid={bid}
        getArray={getArray}
        handlePosDelete={handlePosDelete}
        />}
    </form>
    {/* ********************************* KOT *****************************************/}
    {title === "Food" &&
        <Dialog onClose={handleKOTClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="lg">
        <DialogTitle><FastfoodIcon/> KOT</DialogTitle>
        <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off">
        <div  onClick={handleDatePicker}>
            {FormUtils.renderDatepicker(
              getDateArgObj("date", "Date", "text", minDate, disable)
              )}
          </div>
           <Autocomplete
            id="combo-box-demo"
            options={foods}
            disableClearable
            onChange={(event,value) => handleChange(value)}
            getOptionLabel={(food) => ` ${food.item} ${food.unit}`}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Search Item"  />}
            />
          <TextField required id="standard-required" label="Quantity" name="food"
          type="number"
          value={item.itemQuantity}
          onChange={handleQuantityChange}
          />
           <TextField required id="standard-required" label="Amount" name="food"
            value={item.itemPrice}
            disabled
          />
          <Button 
          type="submit" 
          variant="contained" 
          style={{backgroundColor:"#0088bc",color:'white'}}
          onClick={handleKOT}
          >
            ADD ITEM
          </Button>
        </form>
        </DialogContent>
        {kotArray && <InventoryList 
        kotArray={kotArray}
        title={title}
        data={data}
        setData = {setData}
        handleKOTSUBMIT={handleKOTSUBMIT}
        />}
    </Dialog>
   }
    </>
  );
};

export default POSForm;
