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
  
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Occupancy");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setBillingTypes(types)
  } 
  const fetchAndGenerateReport = async()=>{
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
      data.push(["","TOTAL NO OF PAX :",adults+"+"+children])
      data.push(["","ADULTS :",adults])
      data.push(["","CHILDREN :",children])
      Object.keys(plans[0]).map(el=>{
        data.push(["",el+":",plans[0][el]+"+"+plans[1][el]])
      })
      exportToPDF(data,occupied,continuing)
    }
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

  const exportToPDF = (reportData,occupied,continuing) =>{
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
          theme: 'grid',
          styles: {
            cellWidth:'wrap',
            halign: 'center',
          },
          margin: marginLeft,
          pageBreak:'auto'
        };
        doc.text(title, 300, 30);
        doc.setFontSize(12);
        doc.text("DATE : "+ date,30,60)
        doc.text("DAY : "+ day,30,80)
        doc.text("TOTAL OCCUPIED : "+ occupied,650,60)
        doc.text("OCCUPIED CONT. : "+ continuing,650,80)
        doc.setFontSize(12);
        doc.autoTable(content);
        doc.save("Daily Occupancy Report.pdf")

  }

  return (
    <div>
            <div className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Booking
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
      <Button  type="submit" className="button" onClick={fetchAndGenerateReport}>
        Generate
      </Button>
        </div>

        </div> 
        
    </div>
    
  )
}

export default Occupancy
