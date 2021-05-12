import React from "react";
import Loader from "../../common/Loader/Loader";
import Table from '@material-ui/core/Table';
import { withRouter } from 'react-router-dom'
import { DialogTitle, DialogContent, Button,DialogActions } from "@material-ui/core";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
const moment = require("moment");

const PrintBillForm = props => {
    const {data,onClose,history} = props;
    const [loading, setLoading] = React.useState(false);

    const handleReport = (el)=>{
        onClose();
        let element=[]
        element.push(el)
        element = element.map((e)=>{
            e.firstName = e.guestName
            e.lastName = ""
            e.roomWiseRatesForBooking = e.rooms
            delete e.roomWiseRatesForBooking
            return e
        })
        history.push("/report",el);
    }
  return (
    <React.Fragment>
    <DialogContent>
    {loading && <Loader color="#0088bc" />}
    {data && data.length===0 && <h4 style={{textAlign:"center"}}>No Checkouts Found for Today</h4>}
    {data && data.length>0 && <TableContainer component={Paper} style={{marginTop:"0.7rem", maxHeight:"70vh"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Bill No</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Name of Guest</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Room No</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Checkin Date</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Checkout Date</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Balance</TableCell>
                <TableCell style={{background:"#0088bc", color:"white"}} align="center">Billing Status</TableCell>
                </TableRow>
            </TableHead>
            {
                data.map(el => {
                    let _rooms = el.roomWiseRatesForBooking && el.roomWiseRatesForBooking.map(ele=>{
                        return ele.roomNumber
                    }) 
                    let balance = el.paymentData && el.paymentData.balance;
                    let billingStatus = el.paymentData && el.paymentData.billingStatus;
                    return(
                        <TableRow>
                        <TableCell align="center"><span style={{cursor:"pointer", color:"blue"}} onClick={()=>handleReport(el)}>{el.billingId}</span></TableCell>
                        <TableCell align="center">{el.guestName}</TableCell>
                        <TableCell align="center">{_rooms.toString()}</TableCell>
                        <TableCell align="center">{moment(el.checkIn).format('D.MMM.YYYY')}</TableCell>
                        <TableCell align="center">{moment(el.checkOut).format('D.MMM.YYYY')}</TableCell>
                        <TableCell align="center">{balance}</TableCell>
                        <TableCell align="center">{billingStatus}</TableCell>
                        </TableRow>
                    )
                })
            }
        </Table>
    </TableContainer>}
    </DialogContent>
    </React.Fragment>
  );
};

export default withRouter(PrintBillForm);
