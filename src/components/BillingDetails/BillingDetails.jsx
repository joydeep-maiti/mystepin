import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './BillingDetails.css';
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import billingDetails from '../../services/billingDetails'
import reportOptions from '../../services/reportOptions'
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
  const [startDateString,setStartDateString]=useState(sdate.format('DD')+"-"+sdate.format('MMMM')+"-"+sdate.format('YYYY'));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  var    cdate=moment(currentDate);
  const [currentDateString,setCurrentDateString]=useState(cdate.format('DD')+"-"+cdate.format('MMMM')+"-"+cdate.format('YYYY'));
  const [bookings, setBookings] = useState([]);
  const [billingCategory,setBillingCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [billingTypes, setBillingTypes] = useState([]);
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('DD-MMMM-YYYY')+'-'+moment().format('h:mm A')
  )
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Billing Details");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setBillingTypes(types)
  } 
  
  //Handle starting date Change
  const handleStartingDateChange =(date)=>{
    setStartingDate(utils.getDate(date));  
    var d = moment(date);
    setStartDateString(d.format('DD')+"-"+d.format('MMMM')+"-"+d.format('YYYY'));

  };
  //Handle current date Change
  const handleCurrentDateChange = (date) => {  
    setCurrentDate(utils.getDate(date));
    var d = moment(date);
    setCurrentDateString(d.format('DD')+"-"+d.format('MMMM')+"-"+d.format('YYYY'));

  };
  //Get Plan Options
  const getPlanOptions = () => {
      return billingTypes.map(type => {
      return { label: type, value: type};
    });
  };
  //Handle Select Change
  const handleSelectChange=(event)=>{
    setBillingCategory(event.target.value);
    console.log("event",billingCategory);
    }
  //Getting Booking Details
  // const getBookingsDetails = async (startingDate,currentDate) => { 
  //  const booking = await billingDetails.getBookings(startingDate,currentDate);
  //    let a=201;
  //    console.log("Hari",booking)
  //     if(booking !== null){
  //         booking.forEach(book=>{
  //           let value=[`A/${a++}`,
  //           book.firstName+" "+book.lastName,
  //           utils.getDate(),""
  //           ,"","","","","","","","",book.balance,
  //           "",
  //           "",
  //           ""]
  //            bookings.push(value);
  //           })
  //         }
  //       }

    const exporttoPDF = () =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(20);
        let title = `${billingCategory} Report`;
        let headers = [["Bill No", "Name","Bill Date","Room Rate","Boarding","Tax","Food","Transport","Laundary","Misc","Phone","Total","Advance","Balance"]];
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
        doc.text(title, 350, 40);
        doc.setFontSize(10);
        doc.text("Report Generated at "+generatedTime,620,40);
        doc.setFontSize(15);
        doc.text("From : "+startDateString,100, 90);
        doc.text("To : "+currentDateString,250, 90);
        doc.setFontSize(12);
        doc.autoTable(content);
        doc.save(`${billingCategory}.pdf`)

  }

  const generateReport=()=>{
    //getBookingsDetails(startingDate,currentDate);
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
      
        {FormUtils.renderSelect({
          id: "billingType",
          label: "Billing Details",
          name:"billingType",
          value:billingCategory,
          onChange: event => handleSelectChange(event),
          options: getPlanOptions(),
          disabled: shouldDisable
        })} 
        
        <div className="formdates"> 
              
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
            <div className="buttoncontainer"> 
          <Button  type="submit" className="button" onClick={generateReport}>
            Generate
          </Button>
            </div>
          </div>
        </div>

    )
}

export default BillingDetails
