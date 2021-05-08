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

const RecentCheckouts = ({ allBookings, onClose, title, onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);

    React.useEffect(()=>{
        fetchBills()
    },[])

    const fetchBills = async()=>{
        setLoading(true)
        const res = await billingService.getRecentCheckouts()
        setLoading(false)
        if(res){
            setBills(res)
        }
    }

    const handleReport = (el)=>{
        onClose();
        history.push("/report",el);
    }

    return (
        <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
        {loading && <Loader color="#0088bc" />}
        {bills && bills.length===0 && <h4 style={{textAlign:"center"}}>No Checkouts Found for Today</h4>}
        {bills && bills.length>0 && <TableContainer component={Paper} style={{marginTop:"0.7rem", maxHeight:"70vh"}}>
            <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    <TableCell style={{background:"#0088bc", color:"white"}} align="center">Bill No.</TableCell>
                    <TableCell style={{background:"#0088bc", color:"white"}} align="center">Name of Guest</TableCell>
                    <TableCell style={{background:"#0088bc", color:"white"}} align="center">Room No</TableCell>
                    <TableCell style={{background:"#0088bc", color:"white"}} align="center">Total Amount</TableCell>
                    <TableCell style={{background:"#0088bc", color:"white"}} align="center">Billing Status</TableCell>
                    </TableRow>
                </TableHead>
                {
                    bills.map(el => {
                        let _rooms = el.roomWiseRatesForBooking && el.roomWiseRatesForBooking.map(ele=>{
                            return ele.roomNumber
                        }) 
                        return(
                            <TableRow>
                            <TableCell align="center"><span style={{cursor:"pointer", color:"blue"}} onClick={()=>handleReport(el)}>{el.billingId}</span></TableCell>
                            <TableCell align="center">{el.guestName}</TableCell>
                            <TableCell align="center">{_rooms.toString()}</TableCell>
                            <TableCell align="center">{el.paymentData.posTotal?(Number(el.paymentData.totalRoomCharges)+Number(el.paymentData.posTotal)).toFixed(2):Number(el.paymentData.totalRoomCharges).toFixed(2)}</TableCell>
                            <TableCell align="center">{el.paymentData.billingStatus}</TableCell>
                            </TableRow>
                        )
                    })
                }

            </Table>
        </TableContainer>}
        </DialogContent>
        <DialogActions style={{paddingRight:"2rem", marginTop:"1rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>

      </DialogActions>
        </React.Fragment>
    );
};

export default withRouter(RecentCheckouts);
