import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './BookingTab.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import bookingReport from '../../services/bookingReport'
import reportOptions from '../../services/reportOptions'
import jsPDF from 'jspdf';
import "jspdf-autotable";
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

const BookingTab = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [bookingCategory,setBookingCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [dailyview,setDailyView] = useState(false)
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('D.MMMM.YYYY h:mm A')
  )
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
    setBookingTypes(types)
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
        return bookingTypes.map(type => {
        return { label: type, value: type};
      });
    };
    //Handle Select Change
    const handleSelectChange=(event)=>{
      setBookingCategory(event.target.value);
      console.log("event",bookingCategory);
      }
  

      useEffect(()=>{
        if(bookingCategory === "Daily Booking Chart"){
         setDailyView(false)  
        }
        else{
         setDailyView(true)
        }
      },[bookingCategory])

///Fetching Data from backend
const fetchAndGenerateMonthlyOccupanyReport = async()=>{

  let startD = moment(startingDate).format('yyyy-MM-DD')
  let currentD = moment(currentDate).format('yyyy-MM-DD')
  console.log("Start",startD)
  console.log("End",currentD)

  let options = await bookingReport.getBookingReport(bookingCategory,startD,currentD)

  console.log("Response",options)
  console.log("Category",bookingCategory)
  console.log("monthly report ",options)
  if(options){
  let data = options.map(option=>{
    let booDate = moment(option.bookingDate).format('D-MMMM-YYYY');
    let arriDate = moment(option.dateOfArrival).format('D-MMMM-YYYY');
    let depDate = moment(option.dateOfDeparture).format('D-MMMM-YYYY');
    return([
      booDate,
      option.guestName,
      arriDate,
      depDate,
      option.nights,
      option.NoofRooms,
      option.bookedBy !==null ? option.reference !== null  ? `${option.bookedBy} ${"\n"} ${option.referenceNumber}`: option.bookedBy :"",
      option.Amount, 
      option.Advance
    ])
  })
  exportBookingReportToPDF(data)
}
else{
  alert("No Booking in specfied Category")
}
  
 } 

 const exportBookingReportToPDF = (reportData) =>{
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape
  const marginLeft = 20;
  const marginLeft2 = 350;
  const date = moment().format('D.MMM.YYYY')
  const day = moment().format('dddd')
  const doc = new jsPDF(orientation, unit, size);
  doc.setFontSize(20);
  let title = `${bookingCategory} REPORT`;
  let headers = [["BOOKING DATE","NAME OF THE GUEST","DATE OF ARRIVAL","DATE OF DEPARTURE","NIGHTS","NO OF ROOMS","BOOKED BY","AMOUNT","ADVANCE"]];
  let content = {
    startY: 120,
    head: headers,
    body: reportData,
    theme: 'striped',
    styles: {
      cellWidth:'wrap',
      halign: 'center',
    },
    margin: marginLeft,
    pageBreak:'auto'
  };
  doc.text(title, 300, 40);
  doc.setFontSize(10);
  doc.text("Report Generated at "+generatedTime,1400,20);
  doc.setFontSize(12);
  doc.text("MONTH : "+ "APRIL 21",100,100)
  doc.setFontSize(12);
  doc.autoTable(content);
  doc.setTextColor("#fb3640");
  doc.save(`${bookingCategory} BOOKING REPORT`)
}

  const classes = useStyles();
  const renderFromtoCalender=()=>{
    return (
      <div className="formdates">         
      < MuiPickersUtilsProvider utils={DateFnsUtils}>
           <KeyboardDatePicker
               disableToolbar
               format="dd/MMMM/yyyy"
               margin="normal"
               id="date-picker-dialog"
             label="From"
             value={startingDate}              
             onChange={handleStartingDateChange}
             KeyboardButtonProps={{
               'aria-label': 'change date',
             }}
             style={{ width:'150px'}}
               />
             </MuiPickersUtilsProvider>
             <MuiPickersUtilsProvider utils={DateFnsUtils} 
                           style={{ marginLeft: "rem"}}>
           <KeyboardDatePicker
               disableToolbar
               format="dd/MMMM/yyyy"
               margin="normal"
               id="date-picker-dialog"
             label="To"
             maxDate={currentDate}
             value={currentDate}              
             onChange={handleCurrentDateChange}
             KeyboardButtonProps={{
               'aria-label': 'change date',
             }}
             style={{ marginLeft: "3.5rem",width:'150px'}}
                             />
             </MuiPickersUtilsProvider>
             
             </div>  
    )
  }
  //
  
  const renderDailyCalender=()=>{
   return( 
   <MuiPickersUtilsProvider utils={DateFnsUtils} 
    style={{ marginLeft: "rem"}}>
  <KeyboardDatePicker
  disableToolbar
  format="dd/MMMM/yyyy"
  margin="normal"
  id="date-picker-dialog"
  label="Date Picker"
  value={currentDate}              
  KeyboardButtonProps={{
  'aria-label': 'change date',
  }}
  readOnly
  style={{ width:'350px'}}
      />
  </MuiPickersUtilsProvider>)
  }
  //Booking Tab render
    return (
      <div>
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             Booking
            </Typography>
      </div>
      <div className="container">   
      
          {FormUtils.renderSelect({
            id: "bookingType",
            label: "Booking Type",
            name:"bookingType",
            value:bookingCategory,
            onChange: event => handleSelectChange(event),
            options: getPlanOptions(),
            disabled: shouldDisable
          })}
          { dailyview ? renderFromtoCalender() : renderDailyCalender()}
          <div className="buttoncontainer"> 
        <Button  type="submit" className="button" onClick={fetchAndGenerateMonthlyOccupanyReport}>
          Generate
        </Button>
          </div>
          </div> 
          
      </div>
    )
}

export default BookingTab
