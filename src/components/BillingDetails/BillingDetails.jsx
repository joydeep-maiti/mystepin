import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './BillingDetails.css';
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import billingReport from '../../services/billingReport';

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
  const getBookingsDetails = async () => { 
      let startD = moment(startingDate).format('yyyy-MM-DD')
    let currentD = moment(currentDate).format('yyyy-MM-DD')
    console.log("Start",startD)
    console.log("End",currentD)
     const options = await billingReport.getBillingDetails(startD,currentD,billingCategory);
     console.log("Hari",options)
     console.log("Hari",options.length)
     if(options.length == 0){
       alert("No data available")
     }
     if(options.length !=0){
       let total=[0,0,0,0,0,0,0,0,0,0];
      let data = options.map(option=>{
      
       // console.log(option.tax,option.food)
       
        let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
        total[0] += option.roomrate ? parseInt(option.roomrate) : 0;
        total[1] += option.tax ? parseInt(option.tax.toFixed(2)) : 0;
        total[2] += option.food ? parseInt(option.food) : 0;
        total[3] += option.transport ? parseInt(option.transport) : 0;
        total[4] += option.laundary ? parseInt(option.laundary) : 0;
        total[5] += option.misc ? parseInt(option.misc) : 0;
        total[6] += option.phone ? parseInt(option.phone) : 0;
        total[7] += option.grandTotal ? parseInt(Number(option.grandTotal).toFixed(2)) : 0;
        total[8] += option.advance ? parseInt(option.advance) : 0;
        total[9] += option.Balance ? parseInt(Number(option.Balance).toFixed(2)) : 0;
 
        //let boardingDate = moment(option.boardingDate).format('D-MMMM-YYYY');
       
        return([
         ` ${option.billNo} \n ${option.name}` ,
          billingDate,
         option.roomrate,
          "",
          Number(option.tax).toFixed(2),
          option.food,
          option.transport, 
          option.laundary,
          option.misc,
          option.phone,
          Number(option.grandTotal).toFixed(2),
          option.advance,
          Number(option.Balance).toFixed(2)
        ])
      })
      let data2 =[]
      console.log("total Arrat",total)
      data2.push(["","Total"],["Room Rate :",`${total[0]}`],["Tax :",`${total[1]}`],
                 ["Food :",`${total[2]}`],["Transport :",`${total[3]}`],
                 ["Laundary :",`${total[4]}`],["Misc :",`${total[5]}`],
                 ["Phone :",`${total[6]}`],["Total :",`${total[7]}`],
                 ["Advance :",`${total[8]}`],["Balance :",`${total[9]}`])
      console.log("Data2",data2)
    exporttoPDF(data,data2);
  }
  }
    const exporttoPDF=(data,data2)=>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(20);
        let title = `${billingCategory} Report`;
        let headers = [[`Bill No\nName`,"Bill Date","Room Rate","Boarding","Tax","Food","Transport","Laundary","Misc","Phone","Total","Advance","Balance"]];
        let content = {
          startY: 120,
          head: headers,
          body: data,
          theme: 'striped',
          styles: {
            cellWidth:'wrap',
            halign : "left"
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
        doc.setFontSize(12);
        let finalY = doc.lastAutoTable.finalY; // The y position on the page
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1.5);
        doc.line(18, finalY+1, 825, finalY+1)
        doc.autoTable({
          startY: doc.lastAutoTable.finalY+10,
          body: data2,
          theme: 'grid',
          tableWidth: 300,
          styles: {
            cellWidth:'100',
            columnWidth: "wrap"
          },
          margin: {
            right: 20,
            left: 50
          },
          columnStyles: { 0 : { halign: 'left'},1 : { halign: 'right'}},
          pageBreak:'auto'
        });  
        doc.save(`${billingCategory}.pdf`)
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
          <Button  type="submit" className="button" onClick={getBookingsDetails}>
            Generate
          </Button>
            </div>
          </div>
        </div>

    )
}

export default BillingDetails
