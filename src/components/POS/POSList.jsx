import React from "react";

import { DialogTitle, DialogContent } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import moment from "moment";

const POSList = (props) => {

  console.log("pos",props.pos)

  const [pos, setPos] =  React.useState(null)

  React.useEffect(()=>{
    setPos(props.pos)
  },[props.pos])

  if(!pos){
    return(<></>)
  }

  return (
    <DialogContent>
      POS List
      <TableContainer component={Paper} style={{marginTop:"0.7rem"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                pos && pos.map(el => {
                  return(
                    <TableRow>
                      <TableCell align="center">{moment(el.date).format("Do MMMM YYYY, h:mm a")}</TableCell>
                      <TableCell align="center">{el.amount}</TableCell>
                      <TableCell align="center">{el.remarks}</TableCell>
                    </TableRow>
                  )
                })
              }
              </TableBody>
        </Table>
      </TableContainer>
      
    </DialogContent>
  );
};

export default POSList;
