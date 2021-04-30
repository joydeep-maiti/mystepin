import React, { useEffect, useState } from "react";
import taxService from "../../services/taxService";
import Loader from "../../common/Loader/Loader";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  makeStyles,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Input
  
} from "@material-ui/core";
import { grey ,black,blue} from "@material-ui/core/colors";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor:"#0088bc",
    color: theme.palette.common.white,
  },
  body:{
    fontWeight:"bold",
    width:"10%"
  },
  
  
}))(TableCell);






const useStyles = makeStyles(theme => ({
  
  inputItems: {
    width: "10%"
  },
  span: {
    color: "#0088bc"
  }
}));

const Taxes = ({ onClose }) => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [sam, setsam] = useState([]);
  const [tax , setTax]=useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const taxSlabs = await taxService.getTaxSlabs();
    
    setTaxSlabs(taxSlabs);
    setLoading(false);
  };
   
  const handleInputChange = (e,i) => {
    const slab = [...taxSlabs]
    slab[i].lessThanAndEqual = Number(e.target.value)
    slab[i+1].greaterThan = Number(e.target.value) +1
    setTaxSlabs(slab)
  }

  const handlePercentInputChange = (e,i) => {
    const slab = [...taxSlabs]
    slab[i].taxPercent = Number(e.target.value)
    setTaxSlabs(slab)
  }


  const handleEdit = (row,i) => {
    console.log("taxEdit",row, i) 
  setTax(row,i)
   
  }

  const handleUndo = () => {
    setTax({})
  }

  const handleUpdate = async () => {

    const promises = []
    taxSlabs.forEach(el=>{
      promises.push(taxService.updatetaxDetails(el))
    })
    Promise.all(promises)
    .then(res=>{
      alert("Data Saved!!")
      console.log("promiseAll res", res)
    })
    .catch((err)=>{
      console.log(err)
    })
  
  }

  return (
    <React.Fragment>
      
       <DialogTitle>Tax Calculation</DialogTitle>
       
    <TableContainer className={classes.table} component={Paper} style={{position:"relative",width:"70%" ,right:"-10%"}}>
    <Table className={classes.table} aria-label="simple table"  >
        <TableHead>
          <TableRow>
           
           
          </TableRow>
          <TableRow>
             <StyledTableCell rowSpan={2} align="center">TAX</StyledTableCell>
                        <StyledTableCell rowSpan={2} align="center">SETTINGS</StyledTableCell>
                        
                        
                        <StyledTableCell colSpan={2} align="center" >PRICE RANGE</StyledTableCell>
                        <StyledTableCell rowSpan={2} align="center">VALUE</StyledTableCell>
                      
                      </TableRow>
                      <TableRow>                       
                        <StyledTableCell align="center">RATE FROM</StyledTableCell>
                        <StyledTableCell align="center">RATE TO</StyledTableCell>
                       
                      </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
          <StyledTableCell   align="center" rowSpan={4}><TextField   style={{position:"relative",width:"50%",height:"500%"}} 
          variant="outlined" value="GST"  disabled="true" ></TextField></StyledTableCell>
              <StyledTableCell align="center"rowSpan={4} ><TextField style={{position:"relative",width:"50%"}} 
                variant="outlined" value="%" disabled="true"></TextField></StyledTableCell>
             
          </TableRow>
        {taxSlabs.map((row,i) => (
            <TableRow  key={row._id} >
           
            {tax._id !== row._id && <StyledTableCell align="center"> 
            <TextField  style={{position:"relative",width:"50%"}} 
            variant="outlined"  disabled="true" value={row.greaterThan} /></StyledTableCell>}
                  {tax._id === row._id && <StyledTableCell align="center">
                    <TextField style={{position:"relative",width:"50%"}} 
                      variant="outlined" type="number" label="greaterThan" name="greaterThan" required="true"  disabled="true" value={tax.greaterThan }  />
                  </StyledTableCell>}
                  {
                    i ==2 && <StyledTableCell > </StyledTableCell>
                  }
                 { i==0  && <StyledTableCell align="center">
                    <TextField style={{position:"relative",width:"50%"}} 
                      variant="outlined" type="number" inputProps={{ min: 0, max: 100 }}   name="lessThanAndEqual" value={row.lessThanAndEqual } onChange={(e)=>handleInputChange(e,i)} ></TextField>
                  </StyledTableCell>}
                  { i==1 && <StyledTableCell align="center">
                    <TextField style={{position:"relative",width:"50%"}} 
                      variant="outlined"  type="number" inputProps={{ min: 0, max: 100 }}  name="lessThanAndEqual" value={row.lessThanAndEqual } onChange={(e)=>handleInputChange(e,i)} ></TextField>
                  </StyledTableCell>}
            {  row.taxPercent <=100  && 
             <StyledTableCell align="center">
                    <TextField  style={{position:"relative",width:"50%"}} 
                     variant="outlined" type="number" inputProps={{ min: 0, max: 100 }}  min={0} mix={100} name="taxPercent" value={(row.taxPercent).toFixed(2) } onChange={(e)=>handlePercentInputChange(e,i)} ></TextField>
                  </StyledTableCell> 
                  }
                 { row.taxPercent >100  && <StyledTableCell align="center">
                    <TextField  style={{position:"relative",width:"50%"  }} 
                     variant="outlined" type="number" title="Not a valid"  name="taxPercent" value={alert("Not Valid")}  onChange={(e)=>handlePercentInputChange(e,i)} ></TextField>
                  </StyledTableCell> }  

                  </TableRow>
              
          ))}
        </TableBody>
      

          <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#0088bc",color:'white',position:"relative",right:"-1000px"}} onClick={handleUpdate}> SAVE </Button>

        
      </Table>
    </TableContainer>
   
    


   
    </React.Fragment>
  );
};

export default Taxes;
