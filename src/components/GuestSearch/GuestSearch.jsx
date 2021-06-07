import React from "react";
import { withRouter } from 'react-router-dom'
import { DialogTitle, DialogContent, Button, DialogActions } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import bookingService from '../../services/bookingService'
import Loader from "../../common/Loader/Loader";
import FormControl from '@material-ui/core/FormControl';
import { Typography } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import jsPDF from 'jspdf';
import "jspdf-autotable";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const GuestSearch = ({ allBookings, onClose, title, onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);
    const [searchParam, setSearchParam] = React.useState("");
    const [dateSearchParam, setDateSearchParam] = React.useState(null);

    const handleSearch = async (e) => {
        setBills(null)
        setDateSearchParam(null)
        e.preventDefault();
        setLoading(true)
        const res = await bookingService.searchGuest(searchParam)
        setLoading(false)
        if (res) {
            setBills(res)
        }
    }

    const handleDateSearch = async (e) => {
        setBills(null)
        setSearchParam("")
        e.preventDefault();
        console.log("dateSearchParam",dateSearchParam)
        console.log("dateSearchParam",dateSearchParam.toISOString().split("T")[0])
        setLoading(true)
        const res = await bookingService.searchGuestByDate(dateSearchParam.toISOString().split("T")[0])
        setLoading(false)
        if (res) {
            setBills(res)
        }
    }

    const handleProof = (el) => {
        onClose();
        history.push("/idproof", el._id);
    }

    const handleChange = (e) => {
        setBills(null)
        setSearchParam(e.target.value);
    }

    const handleNewFromDateChange = (date) => {
        setBills(null)
        setDateSearchParam(date)
    };

    const exportToPDF = () =>{
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape
        const marginLeft = 20;
        const marginLeft2 = 350;
        const date = moment().format('D.MMM.YYYY')
        const day = moment().format('dddd')
        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(20);
        let title = "GUEST DETAILS";
        let data = bills.map(el=>{
            let _rooms = el.rooms && el.rooms.map(ele => {
                return ele.roomNumber
            })
            let billAmount = 0
            if(Array.isArray(el.bill) && el.bill[0] && el.bill[0].paymentData){
                billAmount = el.bill[0].paymentData.posTotal?(Number(el.bill[0].paymentData.totalRoomCharges)+Number(el.bill[0].paymentData.posTotal)).toFixed(2):Number(el.bill[0].paymentData.totalRoomCharges).toFixed(2)
            }
            return [el.firstName,el.lastName,_rooms.toString(),el.address,el.contactNumber,el.checkIn?moment(el.checkIn).format('D.MMM.YYYY'):"",el.checkOut?moment(el.checkOut).format('D.MMM.YYYY'):"",billAmount]
        })
        let headers = [["FIRST NAME", "LAST NAME","ROOM NO","ADDRESS","CONTACT","DT. OF ARR","DT. OF DEPT","BILL AMOUNT"]];
        let content = {
          startY: 120,
          head: headers,
          body: data,
          theme: 'striped',
          styles: {
            cellWidth:'wrap',
            halign : "center",
          },
          headerStyles: {
            fillColor: "#0088bc",
            valign: 'middle',
            halign : 'center'
          },
          columnStyles: { 7: { halign: 'right'},4: { halign: 'right'}, 3:{cellWidth:250}},
          margin: marginLeft,
          pageBreak:'auto'
        };
        doc.text(title, 330, 80);
        doc.setFontSize(10);
        doc.text("Report Generated at "+moment().format('D.MMMM.YYYY h:mm A'),600,20);
        doc.setFontSize(12);
        doc.setFontSize(12);
        doc.autoTable(content);
        doc.setTextColor("#fb3640");
        doc.save("Guest.pdf")
    }

    return (
        <React.Fragment>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent style={{maxHeight:"75vh"}}>
                
                <form onSubmit={handleSearch}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
                        <Typography
                            style={{ width: "auto", paddingRight: "10px" }}
                        >
                            First Name / Last Name / Phone No.
                        </Typography>
                        <Typography>:</Typography>
                        <div style={{ width: "auto", padding: "0 10px" }}>
                            <FormControl style={{ width: "100%" }}>
                                <TextField
                                    style={{ width: "100%", textAlign: "right" }}
                                    type="text"
                                    value={searchParam}
                                    onChange={handleChange}
                                    required 
                                    id="standard-required"
                                    name="searchParam"
                                    inputProps={{maxlength:10}} 
                                />
                            </FormControl>
                        </div>
                        <div style={{ width: "auto", paddingLeft: "10px" }}>
                            <Button type="submit" color="primary" variant="contained">
                                Go
                            </Button>
                        </div>
                    </div>
                </form>
                    <div style={{textAlign:"center", margin:"1rem"}}>OR</div>
                <form onSubmit={handleDateSearch}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
                        <Typography
                            style={{ width: "auto", paddingRight: "10px" }}
                        >
                            Checkin Date / Checkout Date
                        </Typography>
                        <Typography>:</Typography>
                        <div style={{ width: "auto", padding: "0 10px" }}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    required
                                    disableToolbar
                                    format="dd/MM/yyyy"
                                    // margin="normal"
                                    id="date-picker-inline"
                                    label="Select Date"
                                    name="fromDate"
                                    value={dateSearchParam}
                                    onChange={handleNewFromDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div style={{ width: "auto", paddingLeft: "10px" }}>
                            <Button type="submit" color="primary" variant="contained">
                                Go
                            </Button>
                        </div>
                    </div>
                </form>
                {loading && <Loader color="#0088bc" />}
                {bills && bills.length === 0 && <h4 style={{ textAlign: "center" }}>No Data Found for the Search Parameter</h4>}
                {bills && bills.length > 0 && <TableContainer component={Paper} style={{ marginTop: "0.7rem", maxHeight: "65vh" }}>
                    <div style={{display:"flex", alignItems:"center" ,justifyContent:"space-between",padding:"0 1rem"}}>
                        <h5>{`Results Found: ${bills.length}`}</h5>
                        <Button onClick={exportToPDF} color="primary" variant="contained">
                            Print
                        </Button>
                    </div>
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">First Name</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Last Name</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Room No</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Address</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Contact</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">CheckIn Date</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">CheckOut Date</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">ID Proof</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Bill Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            bills.map(el => {
                                console.log("el._id",el.proofs)
                                let _rooms = el.rooms && el.rooms.map(ele => {
                                    return ele.roomNumber
                                })
                                let billAmount = 0
                                if(Array.isArray(el.bill) && el.bill[0] && el.bill[0].paymentData){
                                    billAmount = el.bill[0].paymentData.posTotal?(Number(el.bill[0].paymentData.totalRoomCharges)+Number(el.bill[0].paymentData.posTotal)).toFixed(2):Number(el.bill[0].paymentData.totalRoomCharges).toFixed(2)
                                }
                                return (
                                    <TableRow>
                                        <TableCell align="center">{el.firstName}</TableCell>
                                        <TableCell align="center">{el.lastName}</TableCell>
                                        <TableCell align="center">{_rooms.toString()}</TableCell>
                                        <TableCell align="center">{el.address}</TableCell>
                                        <TableCell align="center">{el.contactNumber}</TableCell>
                                        <TableCell align="center">{el.checkIn?moment(el.checkIn).format('D.MMM.YYYY'):""}</TableCell>
                                        <TableCell align="center">{el.checkOut?moment(el.checkOut).format('D.MMM.YYYY'):""}</TableCell>
                                        <TableCell align="center">{el.proofs?<span style={{cursor:"pointer", color:"blue"}} onClick={()=>handleProof(el)}>{el.proofs}</span>:"No ID Proof"}</TableCell>
                                        <TableCell align="center">{billAmount}</TableCell>
                                    </TableRow>
                                )
                            })
                        }

                    </Table>
                </TableContainer>}
            </DialogContent>
            <DialogActions style={{ paddingRight: "2rem", marginTop: "1rem" }}>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>

            </DialogActions>
        </React.Fragment>
    );
};

export default withRouter(GuestSearch);
