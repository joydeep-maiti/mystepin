import React,{useEffect,useState} from "react";
import { withRouter } from 'react-router-dom'
import { DialogTitle, DialogContent, Button,DialogActions } from "@material-ui/core";
import Loader from "../../common/Loader/Loader";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import printBill from '../../services/printBill'
import PrintBillForm from '../PrintBill/PrintBillForm'
import Fuse from 'fuse.js'
const PrintBill = ({ allBookings, onClose, title, onSnackbarEvent, history, handleBookingselection }) => {
    const [forDate, setForDate] = React.useState(null);
    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);
    const [type, setType] = React.useState('billdate');
    const [isName,setIsName] = useState(true)
    const [isBill,setIsBill] = useState(false)
    const [isBillDate,setisBillDate] = useState(false)
    const [name,setName] = useState("")
    const [billNo,setBillNo] = useState("")

    useEffect(() => {
       if(type === 'billdate'){
           setisBillDate(true)
           setIsBill(false)
           setIsName(false)
       }
       else if(type === 'billno'){
        setisBillDate(false)
        setIsBill(true)
        setIsName(false)
       }
       else{
        setisBillDate(false)
        setIsBill(false)
        setIsName(true)
       }
    }, [type])

   
    const handleSearch = () =>{
        if(type === "name" && name){
            fetchGuest()
        }
        else if( type === "billdate" && forDate){
            fetchBills()
        }
        else if( type === "billno" && billNo)
        {
            fetchBillNo()
        }
        else{
            alert("Please enter the data")
        }
        
    }
    //
     const fetchBills = async()=>{
        setLoading(true)
       const res = await printBill.getBillsByDate(forDate.toJSON().split("T")[0])
        console.log("RecentCheckout",res)
        setLoading(false)
        if(res){
            setBills(res)
            console.log("billdate",res)

        }
     }
     const fetchGuest = async()=>{
        setLoading(true)
       const res = await printBill.getAllCheckOuts()
       const options = {
        includeScore: true,
        threshold : 0.1,
        keys: ['guestName']
      }
      const fuse = new Fuse(res, options)
      const result = fuse.search(name)

      let r = result.map(re => {return re.item})
        setLoading(false)
        if(r){
            setBills(r)
            console.log("Guest",r)
        }
     } 
     const fetchBillNo = async()=>{
        setLoading(true)
       const res = await printBill.getAllCheckOuts()
       const options = {
        includeScore: true,
        threshold : 0.1,
        keys: ['billingId']
      }
      const fuse = new Fuse(res, options)
      const result = fuse.search(billNo)

      let r = result.map(re => {return re.item})
        setLoading(false)
        if(r){
            setBills(r)
            console.log("ID",r)

        }
     } 
    //Input Change functions
    const handleNewFromDateChange = (date) => {
        setForDate(date)
    };
    const handleViewChange = (event) => {
        setType(event.target.value);
      };
    const handleNameChange = (e) => {
        setName(e.target.value);
    }
    const handleBillNoChange = (e) => {
        setBillNo(e.target.value)
    }
    return (
        <React.Fragment  >
        <DialogTitle>{title}</DialogTitle>
        <form>
        <DialogContent style={{border:"1px solid gray", margin:"0 1rem"}}>
        {loading && <Loader color="#0088bc" />}
        <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem"}}>
                <Typography
                    style={{width: "35%"}}
                >
                    Search Bill with 
                </Typography>
                <FormControl  style={{width:"100%"}}>
                <RadioGroup aria-label="view" style={{ flexDirection: "row" }} name="view" value={type} onChange={handleViewChange}>
                          <FormControlLabel value="billdate" control={<Radio style={{color:"#0088bc"}}/>} label="Bill Date" />
                          
                          <FormControlLabel value="name" control={<Radio style={{color:"#0088bc"}}/>} label="Guest Name" />
                          
                          <FormControlLabel value="billno" control={<Radio style={{color:"#0088bc"}}/>} label="Bill No" />
                </RadioGroup>
                </FormControl>
            </div>
           {
              isName &&  <div style={{ display:"flex",justifyContent:"center",alignItems:"center", marginBottom:"1rem" }}>
              <Typography
                  style={{width: "auto",paddingRight:"10px"}}
              >
                 Enter Guest Name
              </Typography>
              <Typography>:</Typography>
              <div  style={{width: "auto",padding:"0 10px"}}>
                  <FormControl  style={{width:"100%"}}>
                  <TextField 
                    style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value= {name} 
                        onChange = {handleNameChange}
                        required id="standard-required" 
                        name="guestName"   
                    />
                  </FormControl>
              </div>
              <div style={{width: "auto",paddingLeft:"10px"}}>
              <Button onClick={handleSearch} color="primary" variant="contained">
                       Go
                 </Button>
              </div>
          </div>
          }
          {
              isBill &&  <div style={{ display:"flex",justifyContent:"center",alignItems:"center", marginBottom:"1rem" }}>
              <Typography
                   style={{width: "auto",paddingRight:"10px"}}
              >
                 Enter Bill Number
              </Typography>
              <Typography>:</Typography>
              <div style={{width: "auto",padding:"0 10px"}}>
                  <FormControl  style={{width:"100%"}}>
                  <TextField 
                    style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value= {billNo} 
                        onChange = {handleBillNoChange}
                        required id="standard-required" 
                        name="billNo" 
                        
                    />
                     
                  </FormControl>
              </div>
              <div  style={{width: "auto",paddingLeft:"10px"}}>
              <Button onClick={handleSearch} color="primary" variant="contained">
                       Go
                 </Button>
              </div>
          </div>
          }
          { isBillDate &&
            <div style={{width:"100%", display:"flex",justifyContent:"center",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "auto",paddingRight:"10px"}}
                >
                Choose Billing Date
                </Typography>
                <Typography>:</Typography>
                <div style={{width: "auto",padding:"0 10px"}}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{width:"100%"}}>
                        <KeyboardDatePicker
                        required
                        disableToolbar
                        // variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        // label="Select Date"
                        name="date"
                        value={forDate}
                        onChange={handleNewFromDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div  style={{width: "auto",paddingLeft:"10px"}}>
              <Button onClick={handleSearch} color="primary" variant="contained">
                       Go
                 </Button>
              </div>
            </div>
             }
            {bills  && 
            <PrintBillForm
                data={bills}
                type = {type}
                onClose = {onClose}
            />}
        </DialogContent>
        <DialogActions style={{paddingRight:"2rem", marginTop:"1rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
      </form>
    </React.Fragment>
    );
};

export default withRouter(PrintBill);
