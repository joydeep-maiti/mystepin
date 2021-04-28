import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './Occupancy.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import reportService from '../../services/reportService'
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
const Occupancy = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [occupancyCategory,setOccupancyCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [occupancyTypes, setBillingTypes] = useState([]);
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('D.MMMM.YYYY h:mm A')
  )
  const [dailyview,setDailyView] = useState(false)
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])
   useEffect(()=>{
     if(occupancyCategory === "Daily Occupancy chart"){
      setDailyView(false)  
     }
     else{
      setDailyView(true)
     }
   },[occupancyCategory])
  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Occupancy");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setBillingTypes(types)
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
      return occupancyTypes.map(type => {
      return { label: type, value: type};
    });
  };
  //Handle Select Change
  const handleSelectChange=(event)=>{
    setOccupancyCategory(event.target.value);
    console.log("event",occupancyCategory);
  }

    const classes = useStyles();

   const generateReport =()=>{

    if(occupancyCategory === 'Daily Occupancy chart'){
      fetchAndGenerateDailyOccupanyReport();
    }
   else if(occupancyCategory === 'Monthly Occupancy'){
    fetchAndGenerateMonthlyOccupanyReport();
    }
    else{
      alert("Please Select a category")
    }

   }
   //**************************************Monthly Occupancy Report*************************************
  const fetchAndGenerateMonthlyOccupanyReport = async()=>{

    let startD = moment(startingDate).format('yyyy-M-D')
    let currentD = moment(currentDate).format('yyyy-M-D')
    console.log("Start",startD)
    console.log("End",currentD)

    let options = await reportService.getMonthlyOccupancyReport(occupancyCategory,startD,currentD)


    console.log("Catergory",occupancyCategory)

    console.log("monthly report ",options)
    let data = options.map(option=>{
      let date = moment(option.date).format('D-MMMM-YYYY');
      return([
        date,
        option.TotalRooms,
        option.OccupiedRooms,
        option.Adults,
        option.Children,
        option.Pax,
        option.OccupancyPercent,
      ])
    })
    exportMonthlyOccupantToPDF(data)
  } 
  

//Export Monthly occupancy pdf
    const exportMonthlyOccupantToPDF = (reportData) =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const date = moment().format('D.MMM.YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = "MONTHLY OCCUPANCY REPORT";
    let headers = [["DATE","TOTAL ROOMS","OCCUPIED ROOMS","ADULT","CHILD","TOTAL PAX","OCCUPANCY %"]];
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
    doc.text(title, 300, 80);
    doc.setFontSize(10);
    doc.text("Report Generated at "+generatedTime,600,20);
    doc.setFontSize(12);
    doc.text("MONTH : "+ "APRIL 21",100,100)
    doc.setFontSize(12);
    doc.autoTable(content);
    doc.setTextColor("#fb3640");
    doc.save("Monthly Occupancy Report.pdf")
  }
  

  //************************Daily Occupancy Report****************************
  const fetchAndGenerateDailyOccupanyReport = async()=>{
    let options = await reportService.getDailyOccupancyReport();
    let adults = 0
    let children = 0
    let plans = [{},{}] 
    let occupied = 0
    let continuing =0
    if(options){
      let data = options.map(el=>{
        adults+=Number(el.adults)
        children+=Number(el.children)
        if(el.planType && el.planType.trim()!=="" && !plans[0][el.planType]){
          plans[0][el.planType] = Number(el.adults)
          plans[1][el.planType] = Number(el.children)
        }else if(el.planType && el.planType.trim()!=="" ){
          plans[0][el.planType] = Number(plans[0][el.planType])+Number(el.adults)
          plans[1][el.planType] = Number(plans[1][el.planType])+Number(el.children)
        }
        if(el.guestName && el.guestName.trim()!=="" && moment(el.arraivalDate).format('D.MMM.YYYY') === moment().format('D.MMM.YYYY')){
          occupied+=1
        }else if(el.guestName && el.guestName.trim()!=="" && moment(el.arraivalDate).format('D.MMM.YYYY') !== moment().format('D.MMM.YYYY')){
          continuing+=1
        }
        return([
          el.roomNumber1,
          el.guestName,
          el.planType,
          el.pax,
          el.arraivalDate?moment(el.arraivalDate).format('D.MMM.YYYY'):"",
          el.departureDate?moment(el.departureDate).format('D.MMM.YYYY'):"",
          el.stay,
        ])
      })
      console.log("plans",plans,adults,children)
      let data2 =[]
      data2.push(["TOTAL NO OF PAX :",adults+children+`(${adults}+${children})`])
      data2.push(["ADULTS :",adults])
      data2.push(["CHILDREN :",children])
      Object.keys(plans[0]).map(el=>{
        data2.push([el+":",Number(plans[0][el])+Number(plans[1][el])+"("+plans[0][el]+"+"+plans[1][el]+")"])
      })
      exportDailyOccupantToPDF(data,data2,Number(occupied)+Number(continuing),occupied)
    }
  } 
  

//Export Daily occupancy pdf
    const exportDailyOccupantToPDF = (reportData,data2,occupied,continuing) =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const date = moment().format('D.MMM.YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = "DAILY OCCUPANCY CHART";
    let headers = [["ROOM NO", "NAME OF GUEST","PLAN TYPE","PAX","DT. OF ARR","DT. OF DEPT","STAY"]];
    let content = {
      startY: 120,
      head: headers,
      body: reportData,
      theme: 'striped',
      styles: {
        cellWidth:'wrap',
        halign: 'center',
      },
      headerStyles: {
        fillColor: "#0088bc",
      },
      margin: marginLeft,
      pageBreak:'auto'
    };
    doc.text(title, 300, 80);
    doc.setFontSize(10);
    doc.text("Report Generated at "+generatedTime,600,20);
    doc.setFontSize(12);
    doc.text("DATE : "+ date,30,60)
    doc.text("DAY : "+ day,30,80)
    doc.text("TOTAL OCCUPIED : "+ occupied,650,60)
    doc.text("TODAY'S CHECKIN : "+ continuing,650,80)
    doc.setFontSize(12);
    doc.autoTable(content);
    doc.setTextColor("#fb3640");
    doc.autoTable({
      startY: doc.lastAutoTable.finalY,
      // head: headers,
      body: data2,
      theme: 'grid',
      styles: {
        cellWidth:'wrap',
        halign: 'center',
      },
      bodyStyles: {
        textColor: "#e84545"
      },
      margin: marginLeft,
      pageBreak:'auto'
    });
    doc.save("Daily Occupancy Report.pdf")
  }


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

//Occupancy Render
  return (
    <div>
            <div className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Occupancy
          </Typography>
         </div>
        
    <div className="container">   
    
        {FormUtils.renderSelect({
          id: "occupancy",
          label: "Occupancy Type",
          name:"occupancy",
          value:occupancyCategory,
          onChange: event => handleSelectChange(event),
          options: getPlanOptions(),
          disabled: shouldDisable
        })}
        
  
        { dailyview ? renderFromtoCalender() : renderDailyCalender()}
    
   
        <div className="buttoncontainer"> 
      <Button  type="submit" className="button" onClick={generateReport}>
        Generate
      </Button>
        </div>

        </div> 
        
    </div>
    
  )
}

export default Occupancy