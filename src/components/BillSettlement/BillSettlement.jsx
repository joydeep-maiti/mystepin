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

const BillSettlement = ({ onClose, title, onSnackbarEvent, history }) => {

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

    const handleReport = (el)=>{
        onClose();
        history.push("/report",el);
    }

    return (
        <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
        {loading && <Loader color="#0088bc" />}
        <TableContainer component={Paper} style={{marginTop:"0.7rem", maxHeight:"70vh"}}>
        BillSettlement
        </TableContainer>
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
