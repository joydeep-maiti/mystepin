import React from "react";
import { withRouter } from 'react-router-dom'
import { DialogTitle, DialogContent } from "@material-ui/core";
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

    const [bills, setBills] = React.useState([])
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

    return (
        <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        {/* <AdvancedForm
            allBookings={allBookings}
            onClose={onClose}
            title={title}
            // onSnackbarEvent={onSnackbarEvent}
        /> */}
        <DialogContent>
        {loading && <Loader color="#0088bc" />}
        <TableContainer component={Paper} style={{marginTop:"0.7rem", height:"80vh"}}>
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
                    bills && bills.map(el => {
                    return(
                        <TableRow>
                        <TableCell align="center"><span style={{cursor:"pointer", color:"blue"}} >{el.billingId}</span></TableCell>
                        <TableCell align="center">{el.guestName}</TableCell>
                        <TableCell align="center">{el.guestName}</TableCell>
                        <TableCell align="center">{el.paymentData.totalRoomCharges}</TableCell>
                        <TableCell align="center">{el.paymentData.billingStatus}</TableCell>
                        </TableRow>
                    )
                    })
                }

            </Table>
        </TableContainer>
        </DialogContent>
        </React.Fragment>
    );
};

export default withRouter(RecentCheckouts);
