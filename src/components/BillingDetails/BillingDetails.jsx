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
import html2canvas from 'html2canvas';
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


const BillingDetails = () => {
  const classes = useStyles();
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  var sdate=moment(startingDate);
  const [startDateString,setStartDateString]=useState(sdate.format('D')+"/"+sdate.format('M')+"/"+sdate.format('YYYY'));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  var cdate=moment(currentDate);
  const [currentDateString,setCurrentDateString]=useState(cdate.format('D')+"/"+cdate.format('M')+"/"+cdate.format('YYYY'));
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
  
  //Handle starting date Change
  const handleStartingDateChange =(date)=>{
    setStartingDate(utils.getDate(date));  
    var d = moment(date);
    setStartDateString(d.format('D')+"/"+d.format('M')+"/"+d.format('YYYY'));

  };
  //Handle current date Change
  const handleCurrentDateChange = (date) => {  
    setCurrentDate(utils.getDate(date));
    var d = moment(date);
    setCurrentDateString(d.format('D')+"/"+d.format('M')+"/"+d.format('YYYY'));

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
  const getBookingsDetails = async (startingDate,currentDate) => { 

     const booking = await billingService.getBookings(startingDate,currentDate);
     let a=201;
     console.log(booking)
      if(booking !== null){
          booking.forEach(book=>{
            let value=[`A/${a++}`,
            book.firstName+" "+book.lastName,
            utils.getDate(),""
            ,"","","","","","","","",book.balance,
            "",
            "",
            ""]
             bookings.push(value);
            })
          }
        }
        
        const exporttoPDF = () =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(20);
        let title = "Billing Summary Report";
        let headers = [["Bill No", "Name","Bill Date","Lodging","Boarding","LuxuryTax","Serv Tax","R.Service","Recn.","Taxi","Misc","Laun.","Total","Adv.Rcpt","Adv.Amount","Paid"]];
        let data = bookings
        let content = {
          startY: 120,
          head: headers,
          body: data,
          theme: 'striped',
          styles: {
            cellWidth:'wrap',
            halign: 'center',
          },
          margin: marginLeft,
          pageBreak:'auto'
        };
    
        doc.text(title, 300, 30);
        doc.setFontSize(15);
        doc.text("From : "+startDateString,100, 80);
        doc.text("To : "+currentDateString,700, 80);
        doc.setFontSize(12);
        doc.autoTable(content);
        doc.save("hari.pdf")

  }

  const generateReport=()=>{
    getBookingsDetails(startingDate,currentDate);
    exporttoPDF();
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
