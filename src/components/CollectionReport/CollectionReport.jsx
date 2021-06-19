import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './CollectionReport.css'
import moment from "moment";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import collectionReport from '../../services/collectionReport'


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

const CollectionReport = () => {
  const [startingDate,setStartingDate]=useState(utils.getDate(moment().startOf('month')));
  var sdate=moment(startingDate);
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  var    cdate=moment(currentDate);
  const [startDateString,setStartDateString]=useState(sdate.format('DD')+"-"+sdate.format('MMMM')+"-"+sdate.format('YYYY'));
  const [currentDateString,setCurrentDateString]=useState(cdate.format('DD')+"-"+cdate.format('MMMM')+"-"+cdate.format('YYYY'));
  const [bookings, setBookings] = useState([]);
  const [collectionCategory,setCollectionCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [collectionTypes, setCollectionTypes] = useState([]);
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('DD-MMMM-YYYY')+'-'+moment().format('h:mm A')
  )
  
  //getting options
  useEffect(()=>{
    fetchBillingTypes()
   },[])

  const fetchBillingTypes = async()=>{
    let options = await reportOptions.getBillingOptions("Collection");
    const types = []
    options.forEach(option=>{
      types.push(option)
    })
    setCollectionTypes(types)
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
        return collectionTypes.map(type => {
        return { label: type, value: type};
      });
    };
    //Handle Select Change
    const handleSelectChange=(event)=>{
      setCollectionCategory(event.target.value);
      console.log("event",collectionCategory);
      }

      //Get Collection Report
      const getCollectionReport = async () => { 
        let startD = moment(startingDate).format('yyyy-MM-DD')
      let currentD = moment(currentDate).format('yyyy-MM-DD')
      console.log("Start",startD)
      console.log("End",currentD)
      if(collectionCategory === "Tax Collection")
      {
        var options = await collectionReport.getTaxCollectionReport(startD,currentD,collectionCategory)
      }
       else{
        var options = await collectionReport.getCollectionReport(startD,currentD,collectionCategory)
       
       }
       console.log("Data",options)
       console.log("Data",options.length)
       if(options.length ==0){
         alert("No Data Avalaible")
       }
       if(options.length !=0){
        if(collectionCategory === "Total Collection"){
          let total=[0,0,0,0,0,0,0,0];
          let data = options.map(option=>{
            let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
            total[0] += option.totalAmount ? parseInt(option.totalAmount) : 0;
            total[1] += option.discount ? parseInt(option.discount.toFixed(2)) : 0;
            total[2] += option.grandTotal ? parseInt(option.grandTotal) : 0;
            total[3] += option.advance ? parseInt(option.advance) : 0;
            total[4] += option.cash ? parseInt(option.cash) : 0;
            total[5] += option.card ? parseInt(option.card) : 0;
            total[6] += option.wallet ? parseInt(option.wallet) : 0; 
            total[7] += option.due ? parseInt(option.due) : 0; 
          return([
           ` ${option.billNo} \n ${option.name}` ,
            billingDate,
            option.totalAmount,
            option.discount,
            option.grandTotal, 
            option.advance,
            option.cash,
            option.card,
            option.wallet,
            option.due,
            option.status
          ])
        })
        let data2 =[]
      console.log("total Array",total)
      data2.push(["","Total"],["Total Amount :",`${total[0]}`],["Discount :",`${total[1]}`],
                 ["Grand Total :",`${total[2]}`],["Advance :",`${total[3]}`],
                 ["Cash :",`${total[4]}`],["Card :",`${total[5]}`],
                 ["UPI :",`${total[6]}`],["Due :",`${total[7]}`])
      console.log("Data2",data2)
    exporttoPDF(data,data2);
      //exporttoPDF(data);
        }
       else if(collectionCategory === "Advance"){
        let total=[0,0];
        let data = options.map(option=>{
          let advanceDate = moment(option.advanceDate).format('D-MMMM-YYYY');
          //total[0] += option.grandTotal ? parseInt(option.grandTotal) : 0;
          total[0] += option.advance ? parseInt(option.advance) : 0;
            return([
             advanceDate,
              option.roomNumber,
              option.name,
              option.modeOfPayment, 
              option.receiptNumber,
              option.advance,
              option.billNo
            ])
         
          })
          let data2 =[]
          console.log("total Array",total)
          data2.push(["","Total"],
                     ["Advance Amount :",`${total[0]}`])
          console.log("Data2",data2)
        exporttoPDF(data,data2);
          }
          else if(collectionCategory === "Tax Collection"){
            let total=[0,0];
        let data = options.map(option=>{
          let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
          total[0] += option.roomrate ? parseInt(option.roomrate) : 0;
          total[1] += option.tax ? parseInt(option.tax) : 0;
              return([
               option.billNo,
              billingDate,
              option.name,
                option.roomrate,
                option.tax,
              ])
           
            })
            let data2 =[]
          console.log("total Array",total)
          data2.push(["","Total"],
                     ["Room Rate :",`${total[0]}`],["Tax :",`${total[1]}`])
          console.log("Data2",data2)
          exporttoPDF(data,data2);
            }
          else if(collectionCategory === "Card"){
            let total=[0,0];
        let data = options.map(option=>{
          let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
          total[0] += option.grandTotal ? parseInt(option.grandTotal) : 0;
          total[1] += option.card ? parseInt(option.card) : 0;
              return([
                option.billNo,
                billingDate,
                option.name,
                option.grandTotal, 
                option.cardType,
                option.card
              ])
           
            })
            let data2 =[]
            console.log("total Array",total)
            data2.push(["","Total"],
                       ["Grand Total :",`${total[0]}`],
                       ["Card :",`${total[1]}`])
            console.log("Data2",data2)
          exporttoPDF(data,data2);
            }
            else if(collectionCategory === "Cash"){
              let total=[0,0];
              let data = options.map(option=>{
                let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
                total[0] += option.grandTotal ? parseInt(option.grandTotal) : 0;
                total[1] += option.cash ? parseInt(option.cash) : 0;
                return([
                  option.billNo,
                  billingDate,
                  option.name,
                  option.grandTotal, 
                  option.cash
                ])
             
              })
              let data2 =[]
              console.log("total Array",total)
              data2.push(["","Total"],
                         ["Grand Total :",`${total[0]}`],
                         ["Cash :",`${total[1]}`])
              console.log("Data2",data2)
            exporttoPDF(data,data2);
              }
              else{
                let total=[0,0,0,0,0];
                let data = options.map(option=>{
                  let billingDate = moment(option.billingDate).format('D-MMMM-YYYY');
                  total[0] += option.grandTotal ? parseInt(option.grandTotal) : 0;
                  if(option.walletType === "GooglePay")
                  total[1] += option.wallet ? parseInt(option.wallet) : 0;
                  if(option.walletType === "Phonepe")
                  total[2] += option.wallet ? parseInt(option.wallet) : 0;
                  if(option.walletType === "Paytm")
                  total[3] += option.wallet ? parseInt(option.wallet) : 0;
                  if(option.walletType === "Others")
                  total[4] += option.wallet ? parseInt(option.wallet) : 0;


                  return([
                    option.billNo,
                    billingDate,
                    option.name,
                    option.grandTotal, 
                    option.wallet,
                    option.walletType
                  ])
                })
                let data2 =[]
                console.log("total Array",total)
                data2.push(["","Total"],
                           ["Grand Total :",`${total[0]}`],
                           ["Google Pay :",`${total[1]}`],
                           ["Phonepe :",`${total[2]}`],
                           ["Paytm :",`${total[3]}`],
                           ["Others :",`${total[4]}`])
                console.log("Data2",data2)
              exporttoPDF(data,data2);

              }
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
          let title = `${collectionCategory} Report`;
          let headers = [[`Bill No`,"Bill Date","Total Amount","Discount","Grant Total","Advance","Cash","Card","Wallet","Due","Status"]];
          if(collectionCategory === "Advance"){
            headers = [["Advance Date","Room Number","Guest Name","Mode of Payment","Receipt Number","Amount","Bill No/Booking ID"]];
          }
          else if(collectionCategory === "Total Collection")
          {
           headers = [[`Bill No\nName`,"Bill Date","Total Amount","Discount","Grant Total","Advance","Cash","Card","Wallet","Due","Status"]];
          }
          else if(collectionCategory === "Cash")
          {
           headers = [["Bill No","Bill Date","Name","Grant Total","Cash"]];
          }
          else if(collectionCategory === "Card")
          {
           headers = [["Bill No","Bill Date","Name","Grant Total","Card Number","Card"]];
        
          }
          else if(collectionCategory === "Tax Collection")
          {
           headers = [["Bill No","Bill Date","Name","Room Rate","Tax"]];
        
          }
          else 
          {
            headers = [["Bill No","Bill Date","Name","Grand Total","UPI","UPI Type"]];
        
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
          doc.save(`${collectionCategory}.pdf`)
    }

    const classes = useStyles();
    return (
      <div>
             <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
             Collection
            </Typography>
      </div>
      <div className="container">   
      {FormUtils.renderSelect({
                id: "collection",
                label: "Collection",
                name:"collection",
                value:collectionCategory,
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
        <Button  type="submit" className="button" onClick={getCollectionReport}>
          Generate
        </Button>
          </div>



          </div> 
          
      </div>
      
    )
}

export default CollectionReport
