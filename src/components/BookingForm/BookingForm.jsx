import React from "react";
import { Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Input from "../../common/Input/Input";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';

import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import useStyles from "./BookingFormStyle";
import "./BookingForm.scss";
import ratemasterService from "../../services/ratemasterService";
import Loader from "../../common/Loader/Loader";

const BookingForm = props => {
  const classes = useStyles();

  let [expanded] = React.useState("panel1");
  const {
    onFormSubmit,
    onInputChange: inputfun,
    onDatePickerChange: datefun,
    onSelectChange: selectfun,
    onSelectChange1: selectfun1,
    onAddRoom,
    onDeleteRoom,
    availableRooms,
    data,
    errors,
    options,
    options1,
    onFileSelect,
    onBack,
    shouldDisable,
    openDatePickerCheckIn,
    openDatePickerCheckOut,
    handleDatePicker,
    enableFileUpload,
    onSetPrice
  } = props;
  console.log("props",props)

  const [loading, setLoading] = React.useState(false);
  const [openPriceModal, setOpenPriceModal] = React.useState(false)
  const [dayWiseRates, setDayWiseRates] = React.useState([])
  const [formattedRates, setFormattedRates] = React.useState({})
  const [planTypes, setPlanTypes] = React.useState([
    {planType:"AP"},
    {planType:"CP"},
    {planType:"EP"},
    {planType:"MAP"},
  ]);
  // const roomOptions = availableRooms.map(room => {
  //   return { label: room.roomNumber, value: room.roomNumber };
  // });

  // data.rooms.map(roomId =>
  //   availableRooms.filter(room => {
  //     if (room._id === roomId) selectedRooms.push(room);
  //     return room;
  //   })
  // );

  React.useEffect(()=>{
    if(data["checkIn"] > data["checkOut"]){
      return
    }
    fetchRates()
  },[data["checkIn"],data["checkOut"]])

  React.useEffect(()=>{
    formatRates()
  },[dayWiseRates,data.planType])

  React.useEffect(()=>{
    calculateBookingPrice(formattedRates,data.rooms)
  },[data.rooms])



  const fetchRates = async()=>{
    if(!data["checkIn"] || !data["checkOut"])
      return
    setLoading(true);
    const dayRates = await ratemasterService.getDayWiseRate(data["checkIn"],data["checkOut"]);
    if(dayRates){
      setDayWiseRates(dayRates)
    }
    console.log("----------------dayRates",dayRates)
    setLoading(false);
  }

  const formatRates = ()=>{
    const rates = {}
    dayWiseRates.forEach(el=>{
      if(el.planType === data.planType && !rates[el.roomType]){
        rates[el.roomType] = []
        rates[el.roomType].push(el)
      }else if(el.planType === data.planType && rates[el.roomType]){
        rates[el.roomType].push(el)
      }
    })
    // .sort((a,b) => moment(a.date).isBefore(b.date))
    Object.keys(rates).forEach(el=>{
      // debugger
      let arr = rates[el]
      rates[el] = arr.sort((a,b) => {
        if(a.date > b.date ){
          return 1;
        }
        return -1;
      })
    })
    // console.log
    setFormattedRates(rates)
    calculateBookingPrice(rates,data.rooms)
    
  }

  const calculateBookingPrice = (rates, rooms) => {
    console.log("--------shouldDisable",shouldDisable)
    if(shouldDisable)
      return
    let price = 0
    console.log("rates, rooms",rates, rooms)
    rooms.forEach(room=>{
      rates[room.roomType] && rates[room.roomType].forEach(dayrate=>{
        price += parseInt(dayrate.rate)
      })
    })
    console.log("Final Price",price)
    onSetPrice(price)
  };

  const handleChange = panel => (event, isExpanded) => {
    // setExpanded(isExpanded ? panel : false);
  };

  const getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
      type,
      value: data[id],
      onChange: inputfun,
      error: errors[id],
      disabled: shouldDisable
    };
  };

  const getDateArgObj = (id, label, type, minDate, shouldDisable, open) => {
    return {
      id,
      label,
      type,
      value: data[id],
      onChange: datefun,
      error: errors[id],
      minDate,
      disabled: shouldDisable,
      // open: open
    };
  };

  const getRoomOptions = roomType => {
    // if (availableRooms.length === 0) return [];

    const roomsByType = availableRooms.filter(
      room => room.roomType === roomType
    );
    return roomsByType.map(room => {
      return { label: room.roomNumber, value: room.roomNumber, room };
    });
  };

  const getPlanOptions = () => {

    return planTypes.map(plan => {
      return { label: plan.planType, value: plan.planType};
    });
  };

  const getRoomTypeOptions = (roomtypes) => {

    return roomtypes.map(room => {
      return { label: room.roomType, value: room.roomType};
    });
  };

  const checkRoomError = index => {
    if (errors.rooms && errors.rooms.length > 0) {
      const err = errors.rooms.find(error => error.index === index);
      return err ? err.message : null;
    }

    return null;
  };

  console.log("*******formattedRates",formattedRates)

  return (
    <form onSubmit={event => onFormSubmit(event)}>
      {loading && <Loader color="#0088bc" />}
      <div className="form-group">
        {FormUtils.renderInput(
          getInputArgObj("firstName", "First Name", "text", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj("lastName", "Last Name", "text", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj(
            "contactNumber",
            "Contact Number",
            "number",
            shouldDisable
          )
        )}
      </div>
      <div className="form-group">
        {FormUtils.renderInput(
          getInputArgObj("address", "Address", "text", shouldDisable)
        )}
      </div>
      <div className="form-group">
        <div
          className={classes.datePicker}
          onClick={() => handleDatePicker("checkIn")}
        >
          {FormUtils.renderDatepicker(
            getDateArgObj(
              "checkIn",
              "Check In",
              "text",
              utils.getDate(),
              shouldDisable,
              // openDatePickerCheckIn
            )
          )}
        </div>
        <div
          className={classes.datePicker}
          onClick={() => handleDatePicker("checkOut")}
        >
          {FormUtils.renderDatepicker(
            getDateArgObj(
              "checkOut",
              "Check Out",
              "text",
              data.checkIn,
              shouldDisable,
              // openDatePickerCheckOut
            )
          )}
        </div>
        {FormUtils.renderInput(
          getInputArgObj("adults", "Adults", "number", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj("nights", "Nights Stay", "number", true)
        )}
        {FormUtils.renderInput(
          getInputArgObj("children", "Children", "number", shouldDisable)
        )}
        
      </div>
      <div className="form-group" style={{position:"relative"}}>
        {FormUtils.renderSelect({
          id: "planType",
          label: "Plan Type",
          name:"planType",
          value: data.planType,
          onChange: event => selectfun1(event),
          options: getPlanOptions(),
          disabled: shouldDisable
        })}
        {FormUtils.renderInput(
          getInputArgObj("roomCharges", "Total Room Charge", "number", shouldDisable)
        )}
        <IconButton color="primary" aria-label="Price breakup" style={{position:"absolute",left:"56%", top:"20px"}} onClick={()=>setOpenPriceModal(true)}>
          <InfoOutlinedIcon />
        </IconButton>
        
        {FormUtils.renderInput(
          getInputArgObj("advance", "Advance", "number", shouldDisable)
        )}
      </div>
      <div className="form-group">
        {FormUtils.renderproof({
          id: "proofType",
          name: "proofType",
          label: "Proof Type",
          value: data.proofs,
          onChange: event => selectfun1(event),
          options1,
          disabled: shouldDisable
        })}

        {FormUtils.renderInput(
        getInputArgObj("Idproof", "ID Proof Number", "text", shouldDisable)
        )}
      </div>
      <div className="form-group">
        <div>
          {/* <label htmlFor="proofImage">
            Upload Proof Image  
          </label> */}
          <input
            accept="image/*"
            className={classes.input}
            id="proofImage"
            type="file"
            onChange={onFileSelect}
            disabled= {shouldDisable && !enableFileUpload}
            style={{display:"none"}}
          />
          <label htmlFor="proofImage">
            <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />} disabled= {shouldDisable && !enableFileUpload}>
              Id Proof
            </Button> 
          </label>
          {/* <label htmlFor="proofImage">
          <Button
            variant="contained"
            color="default"
            className={classes.uploadButton}
            startIcon={<CloudUploadIcon />}
          >style={{display:"none"}}
            Upload Proof Image
          </Button>
            
          </label> */}
        </div>

        <div>
          <img src={data["idProofImage"]} width="300px" />
        </div>
      </div>

      <div className={classes.panel}>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <ExpansionPanelSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.panelHeader}
          >
            <div className={classes.expansionPanelSummary} >
              <Typography className={classes.panelLabel} >Room</Typography>
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                onClick={onAddRoom}
                disabled={shouldDisable}
              >
                <AddIcon />
              </Fab>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            {data.rooms.map((room, index) => {
              const error = checkRoomError(index);
              return (
                <div key={`room-${index}`} className="form-group">
                  {FormUtils.renderSelect({
                    id: "roomType",
                    label: "Room Type",
                    value: room.roomType,
                    onChange: event => selectfun(event, index),
                    options:getRoomTypeOptions(options),
                    error,
                    disabled: shouldDisable
                  })}

                  {FormUtils.renderSelect({
                    id: "roomNumber",
                    label: "Room Number",
                    value: room.roomNumber,
                    onChange: event => selectfun(event, index),
                    options: getRoomOptions(room.roomType),
                    error: error ? " " : null,
                    disabled: shouldDisable
                  })}

                  <div>
                    <IconButton
                      color="secondary"
                      className={classes.deleteButton}
                      onClick={() => onDeleteRoom(index)}
                      disabled={index === 0 ? true : shouldDisable}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>

      <div className={classes.button}>
        {FormUtils.renderButton({
          type: "button",
          size: "large",
          label: "Back",
          color: "secondary",
          className: classes.buttonSec,
          disabled: false,
          onClick: onBack
        })}
        {FormUtils.renderButton({
          type: "submit",
          size: "large",
          label: "Submit",
          color: "primary",
          className: null,
          disabled: Object.keys(errors).length || shouldDisable ? true : false
        })}
      </div>
      <Dialog onClose={()=>setOpenPriceModal(false)} aria-labelledby="simple-dialog-title" open={openPriceModal} maxWidth="md" fullWidth={true}>
        {/* <div style={{textAlign:"right", padding:"0.5rem"}}>
          <CloseIcon onClick={()=>setOpenPriceModal(false)} style={{cursor:"pointer"}}/>
        </div> */}
        <DialogTitle id="simple-dialog-title" style={{textAlign:"center"}}>
          Date Wise Price Breakup
          <CloseIcon onClick={()=>setOpenPriceModal(false)} style={{cursor:"pointer", float:"right"}}/>
        </DialogTitle>
          <DialogContent style={{maxHeight:"500px",overflowY:"auto"}}>
            <span style={{float:"right"}}>Nights Stay - {" "+data.nights}</span>
            {Object.keys(formattedRates).map(element => {
              return (
                <React.Fragment>
                  <p>{element}-{data.planType}</p>
                  <div style={{overflowX:"auto"}}>
                  <table className={classes.pricebreaktable}>
                    <tr className={classes.pricebreaktableTr}>
                    {formattedRates[element].map(rate => {                      
                      return(
                        <th className={classes.pricebreaktableTh}>{moment(rate.date).format('D.MMM.YYYY')}</th>
                      )
                    })}
                    </tr>
                    <tr>
                      {formattedRates[element].map(rate => {
                        return(
                          <td className={classes.pricebreaktableTd}>Rate: {rate.rate}</td>
                        )
                      })}
                    </tr>
                    <tr>
                      {formattedRates[element].map(rate => {
                        return(
                          <td className={classes.pricebreaktableTd}>Extra Rate: {rate.extraRate}</td>
                        )
                      })}
                    </tr>
                  </table>
                  </div>
                </React.Fragment>
              )
            })}
            {/* <div>
              {
               dayWiseRates.map(rate => {
                if(rate.planType === data.planType){
                  return(
                    <div>
                      <div>{moment(rate.date).format('Do MMMM YYYY')}</div>
                      <div>{rate.roomType}</div>
                      <div>{rate.rate}</div>
                      <div>{rate.extraRate}</div>
                    </div>
                  )
                }
               }) 
              }
            </div> */}
          </DialogContent>
      </Dialog>
    </form>
  );
};

export default BookingForm;
