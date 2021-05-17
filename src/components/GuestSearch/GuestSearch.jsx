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

const GuestSearch = ({ allBookings, onClose, title, onSnackbarEvent, history }) => {

    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);
    const [searchParam, setSearchParam] = React.useState("");

    const handleSearch = async (e) => {
        setBills(null)
        e.preventDefault();
        setLoading(true)
        const res = await bookingService.searchGuest(searchParam)
        setLoading(false)
        if (res) {
            setBills(res)
        }
    }

    const handleReport = (el) => {
        onClose();
        history.push("/report", el);
    }

    const handleChange = (e) => {
        setSearchParam(e.target.value);
    }

    return (
        <React.Fragment>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {loading && <Loader color="#0088bc" />}
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
                {bills && bills.length === 0 && <h4 style={{ textAlign: "center" }}>No Data Found for the Search Parameter</h4>}
                {bills && bills.length > 0 && <TableContainer component={Paper} style={{ marginTop: "0.7rem", maxHeight: "70vh" }}>
                    <h5 style={{float:"right",padding:"0 1rem"}}>{`Results Found: ${bills.length}`}</h5>
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
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Bill Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            bills.map(el => {
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
