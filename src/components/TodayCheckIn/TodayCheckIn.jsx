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
import moment from 'moment';

const TodayCheckIn = ({ allBookings, onClose, title, onBookingView,onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchBills()
    }, [])

    const fetchBills = async () => {
        setLoading(true)
        const res = await bookingService.getTodaysCheckin()
        setLoading(false)
        if (res) {
            setBills(res)
        }
    }

    const handleReport = (el) => {
        onClose();
        onBookingView(el)
        // history.push("/report", el);
    }

    return (
        <React.Fragment>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {loading && <Loader color="#0088bc" />}
                {bills && bills.length === 0 && <h4 style={{ textAlign: "center" }}>No Checkins Found for Today</h4>}
                {bills && bills.length > 0 && <TableContainer component={Paper} style={{ marginTop: "0.7rem", maxHeight: "70vh" }}>
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Booking Id</TableCell> */}
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">First Name</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Last Name</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Room No</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Address</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Contact</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">CheckIn Date</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">CheckOut Date</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            bills.map(el => {
                                let _rooms = el.rooms && el.rooms.map(ele => {
                                    return ele.roomNumber
                                })
                                return (
                                    <TableRow>
                                        {/* <TableCell align="center"><span style={{cursor:"pointer", color:"blue"}} onClick={()=>handleReport(el)}>{el._id}</span></TableCell> */}
                                        <TableCell align="center">{el.firstName}</TableCell>
                                        <TableCell align="center">{el.lastName}</TableCell>
                                        <TableCell align="center">{_rooms.toString()}</TableCell>
                                        <TableCell align="center">{el.address}</TableCell>
                                        <TableCell align="center">{el.contactNumber}</TableCell>
                                        <TableCell align="center">{el.checkIn?moment(el.checkIn).format('D.MMM.YYYY'):""}</TableCell>
                                        <TableCell align="center">{el.checkOut?moment(el.checkOut).format('D.MMM.YYYY'):""}</TableCell>
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

export default withRouter(TodayCheckIn);
