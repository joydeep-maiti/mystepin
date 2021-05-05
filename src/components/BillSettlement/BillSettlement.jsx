import React, { useState, useEffect } from "react";
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
import BillingSettlementForm from './BillingSettlementForm'
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
import FormUtils from "../../utils/formUtils";
import schemas from "../../utils/joiUtils";
import constants from "../../utils/constants";

const { success, error } = constants.snackbarVariants;

const schema = schemas.billingFormSchema;

const BillSettlement = ({ onClose, title, onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState([])
    const [selectedBill, setSelectedBill] = React.useState(null)
    const [loading, setLoading] = React.useState(false);
    const [forDate, setForDate] = React.useState(null);
    const [paid, setPaid] = React.useState(null);
    const [due, setDue] = React.useState(null);
    const [isDue, setisDue] = React.useState(null);
    const [data, setData] = useState({
        cash: "",
        card: "",
        wallet: "",
        billingStatus:"",
        cardNum:"",
        walletType:"", 
        balance:0   
    });
    const [payment, setPayment] = useState({
        cash: { checked: false, disable: true },
        card: { checked: false, disable: true },
        wallet: { checked: false, disable: true }
    });
    const [errors, setErrors] = useState({});

    React.useEffect(()=>{
        forDate && fetchBills()
    },[forDate])

    React.useEffect(()=>{
        let totalPaid =  0
        let _due = 0
        totalPaid = selectedBill && selectedBill.paymentData && Number(selectedBill.paymentData.cash)+Number(selectedBill.paymentData.wallet)+Number(selectedBill.paymentData.card)
        _due = selectedBill && Number(selectedBill.paymentData.balance)-totalPaid
        console.log("totalPaid",totalPaid,_due)
        setPaid(totalPaid)
        setDue(_due)
        setData({
            ...data,
            balance:_due,
            billingStatus: selectedBill? selectedBill.paymentData.billingStatus : ""
        })
    },[selectedBill])

    const fetchBills = async()=>{
        setLoading(true)
        const res = await billingService.getBillsByDate(forDate.toJSON().split("T")[0])
        setLoading(false)
        if(res && res.length !==0){
            setBills(res)
        }else {  
            openSnackBar("No Bills Found for the Selected Date",error) 
            setBills(res) 
        }
    }
    const openSnackBar = (message, variant) => {
        const snakbarObj = { open: true, message, variant, resetBookings: false };
        onSnackbarEvent(snakbarObj);
    };

    const handleReport = (el)=>{
        onClose();
        history.push("/report",el);
    }

    const handleNewFromDateChange = (date) => {
        setForDate(date)
        setSelectedBill(null)
        // setPaid(null)
        // setDue(null)
    };

    const handleInput = (e) => {
        let _bill = bills.find(el => el._id === e.target.value)
        setSelectedBill(_bill)
    }
    

    useEffect(() => {
        if(!selectedBill){
            return
        }
        let diff = Number(data.balance)- (Number(data.card)+Number(data.cash)+Number(data.wallet))
        console.log("diff",diff,Number(data.card),Number(data.cash),Number(data.wallet), data.balance)
        if(diff <=10){
            setisDue(false)
            setData({
                ...data,
                billingStatus:"Paid",
            })
        }else {
            setisDue(true)
            setData({
                ...data,
                billingStatus:"Due",
            })
        }
    }, [data.cash,data.card,data.wallet,data.balance]);

    const handleInputChange = ({ currentTarget: input }) => {
        const updatedState = FormUtils.handleInputChange(
        input,
        data,
        errors,
        schema
        );

        // updatedState.errors = checkBalance(updatedState.data, updatedState.errors);

        setData(updatedState.data);
        setErrors(updatedState.errors);
    };

    const handleCheckboxChange = (event, name) => {
        // debugger
        const checked = event.currentTarget.checked;
        let clonedData = { ...data };
        let clonedPayment = { ...payment };
        let clonedErrors = { ...errors };

        switch (name) {
        case "cash":
            clonedPayment.cash = { disable: !checked, checked };
            clonedErrors.cash && !checked && delete clonedErrors.cash;
            if (!checked) clonedData.cash = "";
            if (checked) clonedData.cash = Number(data.balance)-(Number(clonedData.card) + Number(clonedData.wallet))
            break;

        case "card":
            clonedPayment.card = { disable: !checked, checked };
            clonedErrors.card && !checked && delete clonedErrors.card;
            if (!checked) clonedData.card = "";
            if (checked) clonedData.card = Number(data.balance)-(Number(clonedData.cash) + Number(clonedData.wallet))
            break;

        case "wallet":
            clonedPayment.wallet = { disable: !checked, checked };
            clonedErrors.wallet && !checked && delete clonedErrors.wallet;
            if (!checked) clonedData.wallet = "";
            if (checked) clonedData.wallet = Number(data.balance)-(Number(clonedData.card) + Number(clonedData.cash))
            break;

        default:
            clonedPayment = { ...clonedPayment };
            break;
        }
        checked && delete clonedErrors.customError;

        // clonedErrors = checkBalance(clonedData, clonedErrors);

        setPayment(clonedPayment);
        setErrors(clonedErrors);
        setData(clonedData);
    };

    const handleChangeData = (temp) => {
        setData({
          ...data,
          ...temp
        })
    };

    const handleFormSubmit = event => {
        event.preventDefault();
        const clonedData = { ...data };
    
        // let errors = FormUtils.validate(clonedData, schema);
        // if (clonedData.cash || clonedData.card || clonedData.wallet || clonedData.billingStatus)
        //   delete errors.customError;
        // else errors.customError = "Please select any payment mode";
    
        if(isDue){
          if(clonedData.billingStatus === "Paid"){
            alert("Total varies from balance. Please make the Billing Status as Due")
            return
          }
          if(!window.confirm("Total varies from balance. Do you want to proceed?")){
            return
          }
        }else {
          if(clonedData.billingStatus !== "Paid"){
            alert("Total matches with balance. Please make the Billing Status as Paid")
            return
          }
          if(!window.confirm("Do you want to proceed with billing?")){
            return
          }
        }

        // const clonedPayment = payment;
        // if (errors.cash) {
        // !clonedPayment.cash.checked && delete errors.cash;
        // }
        // if (errors.card) {
        // !clonedPayment.card.checked && delete errors.card;
        // }
        // if (errors.wallet) {
        // !clonedPayment.wallet.checked && delete errors.wallet;
        // }
        // setErrors(errors);
        // if (Object.keys(errors).length) return;

        // setLoading(true);
        // selectedBooking.checkedOutTime = utils.getTime();
        // selectedBooking.status = { ...selectedBooking.status, checkedOut: true };
        // selectedBooking.totalAmount = selectedBooking.roomCharges;
        // selectedBooking.roomCharges = roomCharges;
        // // console.log("selectedBooking",selectedBooking,clonedData)
        const {posData, ...paymentData} = clonedData
        console.log("clonedData",clonedData)

        const payData = {
            ...selectedBill.paymentData,
            billingStatus: clonedData.billingStatus,
            card: Number(selectedBill.paymentData.card)+Number(clonedData.card),
            cash: Number(selectedBill.paymentData.cash)+Number(clonedData.cash),
            wallet: selectedBill.paymentData.wallet===""?clonedData.wallet:selectedBill.paymentData.wallet+","+clonedData.wallet,
            cardNum: selectedBill.paymentData.cardNum===""?clonedData.cardNum:selectedBill.paymentData.cardNum+","+clonedData.cardNum,
            walletType: selectedBill.paymentData.walletType===""?clonedData.walletType:selectedBill.paymentData.walletType+","+clonedData.walletType,
        }
         
        console.log("payData",payData)
        // updateBookingPayment(selectedBooking,billingData);
    }

    return (
        <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        <form  onSubmit={handleFormSubmit}>
        <DialogContent style={{border:"1px solid gray", margin:"0 1rem"}}>
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
                        // variant="inline"
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
                        value={selectedBill? selectedBill._id:""}
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
                        value={selectedBill?selectedBill.guestName:""} 
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
                        value={selectedBill? selectedBill.totalAmount:""} 
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
                        value={selectedBill?paid:""} 
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
                        value={selectedBill?due:""} 
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
                    Billing Status
                </Typography>
                <Typography>:</Typography>
                <div style={{ width: "40%" }}>
                    <TextField 
                        style={{width:"100%", textAlign:"right"}}
                        type="text" 
                        value={data.billingStatus} 
                        required id="standard-required" 
                        name="guestName" 
                        disabled
                    />
                </div>
            </div>
            {selectedBill && selectedBill.paymentData.billingStatus!=="Paid" && 
            <BillingSettlementForm
                onInputChange={handleInputChange}
                onCheckboxChange={handleCheckboxChange}
                // onFormSubmit={handleFormSubmit}
                data={data}
                errors={errors}
                payment={payment}
                onChangeData={handleChangeData}
            />}
        </DialogContent>
        <DialogActions style={{paddingRight:"2rem", marginTop:"1rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        {selectedBill && selectedBill.paymentData.billingStatus!=="Paid" && 
        <Button type="submit" color="primary" variant="contained">
          Settle
        </Button>}

      </DialogActions>
      </form>
    </React.Fragment>
    );
};

export default withRouter(BillSettlement);
