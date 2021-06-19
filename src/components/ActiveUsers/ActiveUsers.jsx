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
import userService from '../../services/userService'
import Loader from "../../common/Loader/Loader";
const moment = require("moment");

const ActiveUsers = ({ onClose, title, userData }) => {

    const [bills, setBills] = React.useState(null)
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchBills()
    }, [])

    const fetchBills = async () => {
        setLoading(true)
        const res = await userService.getActiveUsers()
        setLoading(false)
        if (res) {
            setBills(res)
        }
    }

    const terminateSession = async(username) => {
        setLoading(true)
        const res = await userService.logout({username})
        setLoading(false)
        console.log("res", res)
        if (res.status===200) {
            fetchBills()
        }
    }

    return (
        <React.Fragment>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {loading && <Loader color="#0088bc" />}
                {bills && bills.length === 0 && <h4 style={{ textAlign: "center" }}>Not Data Available</h4>}
                {bills && bills.length > 0 && <TableContainer component={Paper} style={{ marginTop: "0.7rem", maxHeight: "70vh" }}>
                    <Table size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Sl No.</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Username</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">Login Time</TableCell>
                                <TableCell style={{ background: "#0088bc", color: "white" }} align="center">End Session</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            bills.map((el, i) => {
                                let _rooms = el.rooms && el.rooms.map(ele => {
                                    return ele.roomNumber
                                })
                                return (
                                    <TableRow>
                                        <TableCell align="center">{i + 1}</TableCell>
                                        <TableCell align="center">{el._id}</TableCell>
                                        <TableCell align="center">{moment(el.logId).local(true).format('D.MMM.YYYY, h:mm:ss A')}</TableCell>
                                        <TableCell align="center">
                                            {userData.username !== el._id && <Button size="small" onClick={()=>terminateSession(el._id)} color="secondary">
                                                End
                                            </Button>}
                                        </TableCell>
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

export default withRouter(ActiveUsers);
