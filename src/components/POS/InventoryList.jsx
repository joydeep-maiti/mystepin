import React from "react";

import { DialogTitle, DialogContent,Button } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import moment from "moment";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

const InventoryList = (props) => {
  const {kotArray,handleKOTSUBMIT,data,setData} =props;
  console.log("Inventory",kotArray)
  const [kot, setKot] =  React.useState([])
  const [total,setTotal] = React.useState(null)
  React.useEffect(()=>{
    setKot(kotArray)
  },[kotArray])
  React.useEffect(()=>{
    let total = 0
    kot.map(el => total+= parseInt(el.itemPrice))
    setTotal(total);
    setData({...data,amount:total})
  },[kot])

  if(!kot || kot.length===0 ){
    return(<></>)
  }

  const handleDelete = (el) => {
    props.handlePosDelete(el);
  }

  return (
    <DialogContent>
       <div>Items</div>
      <TableContainer component={Paper} style={{marginTop:"0.7rem"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {
                kot && kot.map(el => {
                  return(
                    <TableRow>
                      <TableCell align="center">{el.itemName}</TableCell>
                      <TableCell align="center">{el.itemQuantity}</TableCell>
                      <TableCell align="center">{el.itemPrice}</TableCell>
                      <TableCell align="center"><DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}}/></TableCell>
                    </TableRow>
                  )
                })
              }
              </TableBody>
        </Table>
        </TableContainer>
        <Button 
          type="submit" 
          variant="contained" 
          style={{backgroundColor:"#0088bc",color:'white',margin:"10px",float:"right"}}
          onClick={handleKOTSUBMIT}

          >
            Save 
          </Button>
          <div className="total">{`Total  : ${total}`}</div>
      
    </DialogContent>
  );
};

export default InventoryList;
