import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './BillingDetails.css';
import moment from "moment";
import utils from "../../utils/utils";
import bookingService from "../../services/bookingService";
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


const BillingDetails = () => {
  const classes = useStyles();
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [startingDateObj, setStartingDateObj] = useState();
  const [currentDateObj, setCurrentDateObj] = useState(utils.getDateObj(utils.getDate()));
  const [billingCategory,setBillingCategory]=useState("");
  const [booking, setBooking] = useState([]);

  useEffect(()=>{
    
  },[])
  //Handle current date Change
  const handleCurrentDateChange = (date) => {  
    setCurrentDate(utils.getDate(date));
    setCurrentDateObj(utils.getDateObj(utils.getDate(date)));
  };
  //Handle starting date Change
  const handleStartingDateChange =(date)=>{
    setStartingDate(utils.getDate(date));  
    setStartingDateObj(utils.getDateObj(utils.getDate(date)));
  };
  //Getting Booking Details
  const setBookings = async (startdate,month) => {
    const allBookings = await bookingService.getBookings(month);
    if (allBookings.length > 0) {
      setBooking(allBookings);
    }     
    console.log(booking);
  };

  //GenerateReport
  const generateReport=()=>{
    const dates=utils.daysBetweenDates(startingDate,currentDate);
    const dateObjs=[];
    dates.map(date=>{
      var d=moment(date);
     dateObjs.push({
        month: d.format('M'),
        day  : d.format('D'),
        year : d.format('YYYY')
      })
    });
    console.log(dateObjs);
    setBookings(dates,dateObjs[0].month);
    console.log("Generating Report");
  }
  //return method
    return (
        <div>
        <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Billing Details
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
            <div className="billingselect">
            <InputLabel id="label">Select Category to Generate Report on Billing </InputLabel>
            <select name="billing" id="billingcategory" onChange={(e)=>{setBillingCategory(e.target.value)}}>
            <option value=""></option>            
            <option value="billingsummary">Billing Summary</option>
            <option value="due">Due</option>
            <option value="settlement">Settlement</option>
            </select>
            </div> 
            <div className="buttoncontainer"> 
            <Button type="submit"  className="button1">
            Back
          </Button>
          <Button  type="submit" className="button2" onClick={generateReport}>
            Generate
          </Button>
            </div>
          </div>
        </div>

    )
}

export default BillingDetails
