import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './Agent.css'
import moment from "moment";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import agentService from '../../services/agentService'

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


const Agent = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  var sdate=moment(startingDate);
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  var    cdate=moment(currentDate);
  const [startDateString,setStartDateString]=useState(sdate.format('DD')+"-"+sdate.format('MMMM')+"-"+sdate.format('YYYY'));
  const [currentDateString,setCurrentDateString]=useState(cdate.format('DD')+"-"+cdate.format('MMMM')+"-"+cdate.format('YYYY'));
  const [bookings, setBookings] = useState([]);
  const [agent,setAgent] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [agentTypes, setAgentTypes] = useState([]);
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('DD-MMMM-YYYY')+'-'+moment().format('h:mm A')
  )
  
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Agent");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setAgentTypes(types)
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
        return agentTypes.map(type => {
        return { label: type, value: type};
      });
    };
    //Handle Select Change
    const handleSelectChange=(event)=>{
      setAgent(event.target.value);
      console.log("event",agent);
      }
  const getAgentReport = async() =>{
    let startD = moment(startingDate).format('yyyy-MM-DD')
      let currentD = moment(currentDate).format('yyyy-MM-DD')
      console.log("Start",startD)
      console.log("End",currentD)
      const options = await agentService.getAgentDetails(startD,currentD,agent);
      console.log("Navy",options)
      if(agent == "Agent Collection"){
        let total=[0,0,0,0,0,0,0,0];
        let data = options.map(option=>{
          let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
          return([
            ` ${option.billNo} ` ,
             billingDate,
             option.guestName,
             option.roomrate,
             option.bookedBy, 
             option.refnumber,
             option.agentname,
           ])
         })
         
         
         exporttoPDF(data);
      }
      else if(agent == "Due from Agent"){
        let total=[0,0,0,0,0,0,0,0];
        let data = options.map(option=>{
          let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
          return([
            ` ${option.billNo} ` ,
             billingDate,
             option.guestName,
             option.roomrate, 
             option.refnumber,
             option.agentname,
             option.status
           ])
         })
         
         
         exporttoPDF(data);
      }
  }
  const exporttoPDF=(data)=>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(20);
        let title = `${agent} Report`;
        let headers = [[`Bill No`,"Bill Date","guestName","roomrate","bookedBy","refnumber","agentname"]];
        if(agent === "Agent Collection"){
          headers = [[`Bill No`,"Bill Date","guestName","roomrate","bookedBy","refnumber","agentname"]];
        }
        else if(agent === "Due from Agent")
        {
         headers = [[`Bill No`,"Bill Date","guestName","roomrate","bookedBy","refnumber","agentname","status"]];
        }
        else if(agent === "Card")
        {
         headers = [["Bill No","Bill Date","Name","Grant Total","Card"]];
      
        }
       
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
        

      
        doc.save(`${agent}.pdf`)
  }

    const classes = useStyles();
    return (
      <div>
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             Agent
            </Typography>
      </div>
      <div className="container">   
     
      {FormUtils.renderSelect({
                id: "agent",
                label: "Agent",
                name:"agent",
                value:agent,
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
        <Button  type="submit" className="button" onClick={getAgentReport}>
          Generate
        </Button>
          </div>



          </div> 
          
      </div>
      
    )
}

export default Agent
