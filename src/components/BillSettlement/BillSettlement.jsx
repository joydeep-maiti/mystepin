import React from "react";
import { withRouter } from 'react-router-dom'
import { DialogTitle, DialogContent, Button,DialogActions } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import billingService from '../../services/billingService'
import Loader from "../../common/Loader/Loader";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';

const BillSettlement = ({ onClose, title, onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState([])
    const [selectedBill, setSelectedBill] = React.useState(null)
    const [loading, setLoading] = React.useState(false);
    const [forDate, setForDate] = React.useState(null);
    const [paid, setPaid] = React.useState(null);
    const [due, setDue] = React.useState(null);

    React.useEffect(()=>{
        forDate && fetchBills()
    },[forDate])

    React.useEffect(()=>{
        let totalPaid =  selectedBill && selectedBill.paymentData && Number(selectedBill.paymentData.cash)+Number(selectedBill.paymentData.wallet)+Number(selectedBill.paymentData.card)
        let _due = selectedBill && Number(selectedBill.paymentData.balance)-totalPaid
        setPaid(totalPaid)
        setDue(_due)
    },[selectedBill])

    const fetchBills = async()=>{
        setLoading(true)
        const res = await billingService.getBillsByDate(forDate.toJSON().split("T")[0])
        setLoading(false)
        if(res){
            setBills(res)
        }
    }

    const handleReport = (el)=>{
        onClose();
        history.push("/report",el);
    }

    const handleNewFromDateChange = (date) => {
        setForDate(date)
    };

    const handleInput = (e) => {
        let _bill = bills.find(el => el._id === e.target.value)
        setSelectedBill(_bill)
    }

    return (
        <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
        {loading && <Loader color="#0088bc" />}
            <div style={{width:"100%", display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                Billing Date
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} style={{width:"100%"}}>
                        <KeyboardDatePicker
                        required
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
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
            </div>
            <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                    Bill Number
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <FormControl  style={{width:"100%"}}>
                        {/* <InputLabel id="demo-simple-select-label"></InputLabel> */}
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        required
                        name="seasonId"
                        value={selectedBill && selectedBill._id}
                        onChange={handleInput}
                        >
                        {bills.map(el=><MenuItem value={el._id}>{el.billingId}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                    Customer Name
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <TextField 
                    style={{width:"100%"}}
                        type="text" 
                        value={selectedBill && selectedBill.guestName} 
                        required id="standard-required" 
                        // label="Customer Name" 
                        name="guestName" 
                        disabled
                    />
                </div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                    Amount
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <TextField 
                        style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value={selectedBill && selectedBill.totalAmount} 
                        required id="standard-required" 
                        // label="Guest Name" 
                        name="guestName" 
                        disabled
                    />
                </div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                    Paid
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <TextField 
                    style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value={paid} 
                        required id="standard-required" 
                        // label="Guest Name" 
                        name="guestName" 
                        disabled
                    />
                </div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-evenly",alignItems:"center", marginBottom:"1rem" }}>
                <Typography
                    style={{width: "35%"}}
                >
                    Due
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <TextField 
                        style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value={due} 
                        required id="standard-required" 
                        // label="Guest Name" 
                        name="guestName" 
                        disabled
                    />
                </div>
            </div>
        </DialogContent>
        <DialogActions style={{paddingRight:"2rem", marginTop:"1rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>

      </DialogActions>
        </React.Fragment>
    );
};

export default withRouter(BillSettlement);
