import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './BillingDetails.css';
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import billingService from '../../services/billingService'
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
  const [bookings, setBookings] = useState([]);
  const [bookingCategory,setBookingCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [billingTypes, setBillingTypes] = React.useState([
    {billingType:"Billing Summary"},
    {billingType:"Due"},
    {billingType:"Settlement"},
  ]);

  useEffect(()=>{
    
  },[])
  //Handle current date Change
  const handleCurrentDateChange = (date) => {  
    setCurrentDate(utils.getDate(date));

  };
  //Handle starting date Change
  const handleStartingDateChange =(date)=>{
    setStartingDate(utils.getDate(date));  

  };
  //Get Plan Options
  const getPlanOptions = () => {
      return billingTypes.map(plan => {
      return { label: plan.billingType, value: plan.billingType};
    });
  };
  //Handle Select Change
  const handleSelectChange=(event)=>{
    setBookingCategory(event.target.value);
    console.log("event",bookingCategory);
    }

  //Getting Booking Details
  // const getBookingsDetails => async (startingDate,currentDate)) => { 
  //    const booking = await billingService.getBookings(startingDate,currentDate);
  //     if(booking !== null){
  //       console.log(booking);
  //       bookings.push(booking);
  //     }
  //   })   
  // };

  //GenerateReport
   // const dates=utils.daysBetweenDates(startingDate,currentDate);
    // const dateObjs=[];
    // dates.map(date=>{
    //   var d=moment(date);
    //  dateObjs.push({
    //     month: d.format('M'),
    //     day  : d.format('D'),
    //     year : d.format('YYYY')
    //   })
    // });
  const generateReport=()=>{
    //getBookingsDetails(startingDate,currentDate);

   
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
              {FormUtils.renderSelect({
                id: "billingType",
                label: "Plan Type",
                name:"billingType",
                onChange: event => handleSelectChange(event),
                options: getPlanOptions(),
                disabled: shouldDisable
              })}
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
