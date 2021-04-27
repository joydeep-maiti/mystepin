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
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

const AdvancedList = (props) => {

  console.log("advance",props.advance)
  const [advance, setAdvance] =  React.useState(null)

  React.useEffect(()=>{
    setAdvance(props.advance)
  },[props.advance])

  if(!advance || advance.length===0 ){
    return(<></>)
  }

  const handleDelete = (el) => {
    console.log("el",el)
    props.handlePosDelete(el);
  }

  return (
    <DialogContent>
       <div>{"Advanced"}</div>
      <TableContainer component={Paper} style={{marginTop:"0.7rem"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Advanced</TableCell>
                  <TableCell align="center">Mode of Payment</TableCell>
                  <TableCell align="center">Recipt Number</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              {
                advance && advance.map(el => {
                  return(
                    <TableRow>
                      <TableCell align="center">{moment(el.date).format("Do MMMM YYYY")}</TableCell>
                      <TableCell align="center">{el.advanceP}</TableCell>
                      <TableCell align="center">{el.modeofpayment}</TableCell>
                      <TableCell align="center">{el.reciptNumber}</TableCell>
                      <TableCell align="center"><DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}} onClick={()=>handleDelete(el)}/></TableCell>
                    </TableRow>
                  )
                })
              }
        </Table>
      </TableContainer>
      
    </DialogContent>
  );
};

export default AdvancedList;
