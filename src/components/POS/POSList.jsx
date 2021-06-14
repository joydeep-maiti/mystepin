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

const POSList = (props) => {
  console.log("POS Elements",props.pos)
  const [pos, setPos] =  React.useState(null)
  React.useEffect(()=>{
    setPos(props.pos)
  },[props.pos])

  if(!pos || pos.length===0 ){
    return(<></>)
  }

  const handleDelete = (el) => {
    console.log("el",el)
    props.handlePosDelete(el);
  }
  const handleKOTDisplay=(el)=>{
    console.log()
    if(el.kotId){
      props.getArray(props.bid,el.kotId);
    }
  }

return (
    <DialogContent>
       <div>{"POS-"+props.title+" Transaction"}</div>
      <TableContainer component={Paper} style={{marginTop:"0.7rem"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                 {
                  props.view === "kot" ? 
                  <TableRow>
                   <TableCell align="center">KOT ID</TableCell>
                  <TableCell align="center">DATE</TableCell>
                  <TableCell align="center">AMOUNT</TableCell>
                  <TableCell align="center">Delete</TableCell>
                  </TableRow>
                  :
                    <TableRow>
                    <TableCell align="center">Date</TableCell>
                   <TableCell align="center">Amount</TableCell>
                   <TableCell align="center">Remarks</TableCell>
                   <TableCell align="center">Delete</TableCell>
                   </TableRow>
                  
                 }  
                 
                 
              </TableHead>
              <TableBody>
              {
                pos && pos.map(el => {
                  return(
  
                      props.view === "kot" ? 
                      <TableRow>
                      <TableCell align="center"><span style={{cursor:"pointer", color:"blue"}} onClick={()=>{handleKOTDisplay(el)}}>{el.kotId}</span></TableCell>
                      <TableCell align="center">{moment(el.date).format("Do MMMM YYYY")}</TableCell>
                      <TableCell align="center">{el.amount}</TableCell>
                      <TableCell align="center"><DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}} onClick={()=>handleDelete(el)}/></TableCell>
                     </TableRow>
                      :
                      <TableRow>
                      <TableCell align="center">{moment(el.date).format("Do MMMM YYYY")}</TableCell>
                      <TableCell align="center">{el.amount}</TableCell>
                      <TableCell align="center">{el.remarks}</TableCell>
                      <TableCell align="center"><DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}} onClick={()=>handleDelete(el)}/></TableCell>
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
