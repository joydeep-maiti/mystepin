import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './POSSales.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import jsPDF from 'jspdf';
import "jspdf-autotable";
import posReportService from '../../services/posReportService'
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

const POSSales = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [posCategory,setPosCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [posTypes, setPosTypes] = useState([]);
  const [posTotal,setPosTotal] = useState(0);
  var sdate=moment(startingDate);
  const [startDateString,setStartDateString]=useState(sdate.format('DD')+"-"+sdate.format('MMMM')+"-"+sdate.format('YYYY'));
  var cdate=moment(currentDate);
  const [currentDateString,setCurrentDateString]=useState(cdate.format('DD')+"-"+cdate.format('MMMM')+"-"+cdate.format('YYYY'));
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("POS Sales");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setPosTypes(types)
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
        return posTypes.map(type => {
        return { label: type, value: type};
      });
    };
    //Handle Select Change
    const handleSelectChange=(event)=>{
      setPosCategory(event.target.value);
      console.log("event",posCategory);
      }
  //Report Generation
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('DD-MMMM-YYYY h:mm A')
  )
  let total=0;
  const fetchAndGeneratePOSReport = async()=>{
    let startD = moment(startingDate).format('yyyy-MM-DD')
    let currentD = moment(currentDate).format('yyyy-MM-DD')
    console.log("Start",startD)
    console.log("End",currentD)
    let options = await posReportService.getPosReport(posCategory,startD,currentD)
    console.log("Response",options)
    console.log("Category",posCategory)
    console.log("options",options.length);
    if(options.length ==0){
      alert("No data Avaialabe")
    }
    else if(options.length !=0){
    if(posCategory !== "All POS"){
      let data = options.map(option=>{
        let date = moment(option.date).format("DD-MMMM-yyyy");
        total += parseInt(option.amount)
        return([
          date,
          option.roomNo,
          option.amount,
          option.remarks
        ])
      })
      setPosTotal(total)
      console.log("POSTotal",total);
      console.log("POSDATA",posTotal)
      exportPOSReportToPDF(data,total)
    }else{
      let total=[0,0,0,0,0,0,0,0,0,0];
      let data = options.map(option=>{
        let date = moment(option.date).format("DD-MMMM-yyyy");
       total[0] += option.Food ? parseInt(option.Food) : 0;
       total[1] += option.Transport ? parseInt(option.Transport) : 0;
       total[2] += option.Laundary ? parseInt(option.Laundary) : 0;
       total[3] += option.Agent ? parseInt(option.Agent) : 0;
       total[4] += option.Others ? parseInt(option.Others) : 0;  
      
        return([
          date,
          option.guestName,
          option.Food,
          option.Transport,
          option.Laundary,
          option.Agent,
          option.Others,
          option.Total
        ])
      })   
      setPosTotal(total)
      console.log("POSTotal",total);
      let data2 =[]
      console.log("total Arrat",total)
      data2.push(["","Total"],["Food :",`${total[0]}`],["Transport :",`${total[1]}`],
                 ["Laundary :",`${total[2]}`],["Agent :",`${total[3]}`],
                 ["Others :",`${total[4]}`])
      console.log("Data2",data2)
      exportPOSReportToPDF(data,data2)

    }
   }
  else{
    alert("No POS Sales in specfied Category")
  }
  } 
    
    const exportPOSReportToPDF = (reportData,data2) =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const date = moment().format('D-MMM-YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = `${posCategory} REPORT`;
    let headers = [["DATE","ROOM NO","AMOUNT","REMARKS"]];
    if(posCategory === "All POS"){
      headers = [["DATE","GUEST NAME","FOOD","TRANSPORT","LAUNDARY","AGENT","OTHERS","TOTAL"]];
    }
    let content = {
      startY: 120,
      head: headers,
      body: reportData,
      theme: 'striped',
      styles: {
        cellWidth:'wrap',
        halign : "left",
      },
      margin: marginLeft,
      pageBreak:'auto'
    };
    doc.text(title, 300, 40);
    doc.setFontSize(10);
    doc.text("Report Generated at "+generatedTime,620,40);
    doc.setFontSize(12);
    doc.text("From : "+startDateString,100, 90);
    doc.text("To : "+currentDateString,250, 90);
    doc.setFontSize(12);
    doc.autoTable(content);
    doc.setFontSize(12);
    let finalY = doc.lastAutoTable.finalY; // The y position on the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.5);
    doc.line(18, finalY+1, 825, finalY+1)
    if(posCategory === "All POS")
    {
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
    }
    else{
      doc.text(320, finalY+100, `Total ${posCategory} Sales   =     ${total}`);
    }
    doc.save(`${posCategory} SALES REPORT`)
  }
    const classes = useStyles();
    return (
      <div>
      <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             POS Sales
            </Typography>
      </div>
      <div className="container">   
     
      {FormUtils.renderSelect({
                id: "possales",
                label: "POS Sales",
                name:"possales",
                value:posCategory,
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
        <Button  type="submit" className="button" onClick={fetchAndGeneratePOSReport}>
          Generate
        </Button>
          </div>
        </div>
      </div>
    )
  }

export default POSSales
