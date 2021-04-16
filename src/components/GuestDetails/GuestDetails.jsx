import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './GuestDetails.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom:"5rem"
  },
  title: {
    flexGrow: 2
  },
  buttons:{
    marginTop: 20
  }
}));
const GuestDetails = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [guestCategory,setGuestCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [guestTypes, setGuestTypes] = useState([]);
  
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Booking");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setGuestTypes(types)
  } 
  
    //Handle starting date Change
    const handleStartingDateChange =(date)=>{
      setStartingDate(utils.getDate(date));  
          };
    //Handle current date Change
    const handleCurrentDateChange = (date) => {  
      setCurrentDate(utils.getDate(date));
     };
    //Get Plan Options
    const getPlanOptions = () => {
        return guestTypes.map(type => {
        return { label: type, value: type};
      });
    };
    //Handle Select Change
    const handleSelectChange=(event)=>{
      setGuestCategory(event.target.value);
      console.log("event",guestCategory);
      }
  
 

    const classes = useStyles();
    return (
      <div>
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Guest Details
            </Typography>
      </div>
      <div className="container">   
      <div className="formdates">  
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
       <KeyboardDatePicker
            disableToolbar
            format="MM/dd/yyyy"
           margin="normal"
           id="date-picker-dialog"
          label="From"
          value={startingDate}              
          onChange={handleStartingDateChange}
          KeyboardButtonProps={{
           'aria-label': 'change date',
          }}
         style={{ marginRight: "2rem",width:'150px'}}
           />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils} 
                        style={{ marginLeft: "1rem"}}>
       <KeyboardDatePicker
            disableToolbar
            format="MM/dd/yyyy"
           margin="normal"
           id="date-picker-dialog"
          label="To"
          value={currentDate}              
          onChange={handleCurrentDateChange}
          KeyboardButtonProps={{
           'aria-label': 'change date',
          }}
         style={{ marginLeft: "0.5rem",width:'150px'}}
                          />
          </MuiPickersUtilsProvider>
          </div>  
          <div className="GuestDetailsselect">
          <InputLabel id="label">Select Category to Generate Report on GuestDetails </InputLabel>
          {FormUtils.renderSelect({
                id: "guest",
                label: "Guest",
                name:"guest",
                value:guestCategory,
                onChange: event => handleSelectChange(event),
                options: getPlanOptions(),
                disabled: shouldDisable
              })}
          </div> 
          <div className="buttoncontainer"> 
          <Button type="submit"  className="button1">
          Back
        </Button>
        <Button  type="submit" className="button2">
          Generate
        </Button>
          </div>
        </div>
      </div>


    )
}

export default GuestDetails
