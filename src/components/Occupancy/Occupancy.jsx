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
    if(options){
      let data = options.map(el=>{
        return([
          el.roomNumber1,
          el.guestName,
          el.balance,
          el.pax,
          el.arraivalDate?moment(el.arraivalDate).format('D.MMM.YYYY'):"",
          el.departureDate?moment(el.departureDate).format('D.MMM.YYYY'):"",
          el.stay,
          el.receipt,
          el.advance,
        ])
      })
      exportToPDF(data)
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

  const exportToPDF = (reportData) =>{
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
        let headers = [["ROOM No", "Name of Guest","Balance","Pax","DT. of Arr","DT. of Dept","Stay","Receipt No","Advance"]];
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
        doc.text(title, 300, 30);
        doc.setFontSize(12);
        doc.text("Date : "+ date,30,60)
        doc.text("Day : "+ day,30,80)
        doc.setFontSize(12);
        doc.autoTable(content);
        doc.save("test.pdf")

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
