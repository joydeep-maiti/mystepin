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
import guestReport from '../../services/guestReport'
import roomService from '../../services/roomService'
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
const GuestDetails = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [guestCategory,setGuestCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [guestTypes, setGuestTypes] = useState([]);
  const [isRoomWise,setIsRoomWise] = useState(false)
  const [roomNumbers,setRoomNumbers] = useState([])
  const [roomNumber,setRoomNumber] = useState("")
  let headers=[];
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('D-MMMM-YYYY h:mm A')
  )
  var sdate=moment(startingDate);
  const [startDateString,setStartDateString]=useState(sdate.format('DD')+"-"+sdate.format('MMMM')+"-"+sdate.format('YYYY'));
  var    cdate=moment(currentDate);
  const [currentDateString,setCurrentDateString]=useState(cdate.format('DD')+"-"+cdate.format('MMMM')+"-"+cdate.format('YYYY'));
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])
   useEffect(()=>{
      fetchRooms()
   },[])

    const fetchRooms = async()=>{
      const rooms = await roomService.getRooms();
      console.log("Rooms",rooms)
      const roomN =[]
          rooms.map(room=>{
            let obj={roomNumber:room.roomNumber,roomType:room.roomType}
            roomN.push(obj)
          })
          setRoomNumbers(roomN)
        }
        console.log("Room Numbers",roomNumbers)
   useEffect(()=>{
      if(guestCategory === "Room Wise"){
        setIsRoomWise(true)
      }
      else{
        setIsRoomWise(false)
      }
   },[guestCategory])
  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Guest Report");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setGuestTypes(types)
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


    //Report Function

    const generateReport=()=>{
      if(guestCategory !== "Room Wise"){fetchAndGenerateGuestReport()}
      else{
        fetchRoomWiseReport()
      }

    }

    ///Fetching Data from backend
const fetchAndGenerateGuestReport = async()=>{
  let startD = moment(startingDate).format('yyyy-MM-DD')
  let currentD = moment(currentDate).format('yyyy-MM-DD')
  console.log("Start",startD)
  console.log("End",currentD)
  let options = await guestReport.getGuestDetails(startD,currentD,guestCategory)
  let len = options.length || 0 ;
  console.log("len",len)
  console.log("Response",options)
  console.log("Category",guestCategory)
  if(options){
    if(guestCategory === "Guest"){
      let data = options.map(option=>{
        let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
        let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
        return([
          option.guestName,
          checkIn,
          checkOut,
          option.NoofRooms,
          option.nationality,
          option.bookedBy,
          option.referenceNumber,
          option.Amount,
          option.Advance,
        ])
      })
      exportGuestReportToPDF(data,len)
    }
    else{
      let data = options.map(option=>{
        let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
        let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
        return([
          option.guestName,
          checkIn,
          checkOut,
          option.NoofRooms,
          option.nationality,
          option.PassportNumber,
          option.bookedBy,
          option.referenceNumber,
          option.Advance,
          option.Amount,
        ])
      })
      exportGuestReportToPDF(data,len)
    }
  
}
else{
  alert("No Guest in specfied Category")
}
}
const fetchRoomWiseReport= async()=>{
  let startD = moment(startingDate).format('yyyy-MM-DD')
  let currentD = moment(currentDate).format('yyyy-MM-DD')
  console.log("Start",startD)
  console.log("End",currentD)
  let options = await guestReport.getGuestDetails(startD,currentD,guestCategory,roomNumber)
  let len = options.length || 0 ;
  console.log("len",len)
  console.log("Response",options)
  console.log("Category",guestCategory)
  if(options){
      let data = options.map(option=>
        {
        let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
        let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
        return([
          option.guestName,
          checkIn,
          checkOut,
          option.roomNumber,
          option.nationality,
          option.bookedBy,
          option.referenceNumber,
          option.Amount,
          option.Advance,
        ])
      })
      exportGuestReportToPDF(data,len)
    }
    else{
  alert("No Guest in specfied Category")
    }

}
//Set Room Number

const handleRoomChange = async (event) => {
  setRoomNumber(event.target.value);
  console.log("Room Number",roomNumber)
};


//Room Options

const getRoomOptions = () => {
  return roomNumbers.map(type => {
    return { label: type.roomNumber +" - "+type.roomType, value: type.roomNumber};
  });
};


 const exportGuestReportToPDF = (reportData,len) =>{
  const unit = "pt";
  const size = "A3"; // Use A1, A2, A3 or A4
  const orientation = "landscape"; // portrait or landscape
  const marginLeft = 20;
  const marginLeft2 = 350;
  const date = moment().format('D.MMM.YYYY')
  const day = moment().format('dddd')
  const doc = new jsPDF(orientation, unit, size);
  doc.setFontSize(20);
  let title = guestCategory === "Guest" ? "Domicillary Guest Report ":`${guestCategory} REPORT`;
  let headers = [["NAME OF THE GUEST","CHECKIN","CHECKOUT","NO OF ROOMS","NATIONALITY","BOOKED BY","REFERENCE NUMBER","BILLING ADVANCE","BILLING AMOUNT"]];
  if(guestCategory === "Foreign Guest"){
    headers = [["NAME OF THE GUEST","CHECKIN","CHECKOUT","NO OF ROOMS","NATIONALITY","PASSPORT NUMBER","BOOKED BY","REFERENCE NUMBER","BILLING ADVANCE","BILLING AMOUNT"]];
  }
  if(guestCategory === "Room Wise")
  {
   headers = [["NAME OF THE GUEST","CHECKIN","CHECKOUT","ROOM NO","NATIONALITY","BOOKED BY","REFERENCE NUMBER","BILLING ADVANCE","BILLING AMOUNT"]];

  }
  let content = {
    startY: 120,
    head: headers,
    body: reportData,
    theme: 'striped',
    styles: {
      cellWidth:'wrap',
      halign : 'left',
    },
    headerStyles: {
      valign: 'middle', 
      6 : { halign: 'right'},3 : { halign: 'right'},7: { halign: 'right'},8: { halign: 'right'}
    },
    columnStyles: { 6 : { halign: 'right'},3 : { halign: 'right'},7: { halign: 'right'},8: { halign: 'right'}},
    margin: marginLeft,
    pageBreak:'auto'
  };
  doc.text(title, 500, 40);
  doc.setFontSize(10);
  doc.text("Report Generated at "+generatedTime,900,40);
  doc.setFontSize(15);
  doc.text("From : "+startDateString,100, 90);
  doc.text("To : "+currentDateString,250, 90);
  doc.text("No of Guests : "+len,400,90)
  if(guestCategory === "Room Wise"){
    doc.text("Room Number : "+roomNumber,550,90)
  }
   
  doc.setFontSize(12);
  doc.autoTable(content);
  doc.setTextColor("#fb3640");
  doc.save(guestCategory === "Guest" ? "Domicillary Guest Report ":`${guestCategory} REPORT`)
}
    return (
      <div>
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             Guest
            </Typography>
      </div>
      <div className="container">   
      {FormUtils.renderSelect({
                id: "guest",
                label: "Guest",
                name:"guest",
                value:guestCategory,
                onChange: event => handleSelectChange(event),
                options: getPlanOptions(),
                disabled: shouldDisable
              })}


        { isRoomWise && FormUtils.renderSelect({
                    id: "roomNumber",
                    label: "Room Number",
                    value: roomNumber,
                    onChange: event => handleRoomChange(event),
                    options: getRoomOptions(),
                    disabled: shouldDisable
                  })
        }

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

export default GuestDetails
