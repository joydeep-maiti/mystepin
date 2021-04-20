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
    fontWeight:"bold"
  }
  
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);




const useStyles = makeStyles(theme => ({
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    maxWidth:"500px",
    backgroundColor: 'white'
  },
  inputItems: {
    width: "70%"
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
      console.log("promiseAll res", res)
    })
    .catch((err)=>{
      console.log(err)
    })
   // setLoading(true);
     
    // if(taxSlabs[1].greaterThan >taxSlabs.lessThanAndEqual){
     // const res = await taxService.updatetaxDetails(tax);
    // }else{
    //   alert("invalid");
    // }
   
    //setLoading(false);
   // if((res) && (taxSlabs[1].greaterThan < taxSlabs.lessThanAndEqual) ){
     
      
    // }
    // else{
    //   alert("invalid");
    // }
    //console.log(taxSlabs[1].greaterThan)
  }

  return (
    <React.Fragment>
      {/* <DialogTitle>Tax Slabs</DialogTitle>
      {loading && <Loader color="#0088bc" />}
      <table>
      <DialogContent>
        {taxSlabs.map(taxInfo => (
          <div key={taxInfo._id} className={classes.formGroup}>
            <Typography
              display={"block"}
              nowrap={"true"}
              className={classes.inputItems}
            >
              Greater Than{" "}
              {<span className={classes.span}>{taxInfo.greaterThan }</span>}{" "}
              {taxInfo.lessThanAndEqual ? "and less than equal to " : ""}
              {taxInfo.lessThanAndEqual && (
                <span className={classes.span}>{taxInfo.lessThanAndEqual}</span>
              )}
            </Typography>
            <Typography>:</Typography>
            <Typography>{`${taxInfo.taxPercent}%`}</Typography>
          </div>
        ))}
        
      </DialogContent>

      </table> */}
      {/* <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions> */}
       <DialogTitle>Tax Caluclation</DialogTitle>
       
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
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
          <StyledTableCell   align="center" rowSpan={4}><TextField   variant="outlined" value="GST"  disabled="true" ></TextField></StyledTableCell>
              <StyledTableCell align="center"rowSpan={4} ><TextField   variant="outlined" value="%" disabled="true"></TextField></StyledTableCell>
              
          </TableRow>
        {taxSlabs.map((row,i) => (
            <TableRow  key={row._id} >
              
             {/* <StyledTableCell align="center"  ><TextField   variant="outlined" value={row.greaterThan } onChange={handleInputChange}  > </TextField></StyledTableCell> */}
            
            
            {tax._id !== row._id && <StyledTableCell align="center"> <TextField  variant="outlined"  disabled="true" value={row.greaterThan} /></StyledTableCell>}
                  {tax._id === row._id && <StyledTableCell align="center">
                    <TextField  variant="outlined" type="number" label="greaterThan" name="greaterThan" required="true"  disabled="true" value={tax.greaterThan }  />
                  </StyledTableCell>}
           
                 
                  
            
            
              {/* <StyledTableCell align="center" ><TextField   variant="outlined" value={row.lessThanAndEqual } ></TextField></StyledTableCell> */}

              {/* {tax._id !== row._id && <StyledTableCell align="center"> <TextField  variant="outlined"  value={row.lessThanAndEqual } /></StyledTableCell>} */}
                  <StyledTableCell align="center">
                    <TextField   variant="outlined"  type="number" label="lessThanAndEqual" name="lessThanAndEqual" value={row.lessThanAndEqual }    onChange={(e)=>handleInputChange(e,i)} ></TextField>
                  </StyledTableCell>

              {/* <StyledTableCell align="center" ><TextField   variant="outlined" value={row.taxPercent}></TextField></StyledTableCell> */}


              {/* {tax._id !== row._id && <StyledTableCell align="center"><TextField  variant="outlined"  value={row.taxPercent } /></StyledTableCell>} */}
                  <StyledTableCell align="center">
                    <TextField   variant="outlined" type="number"  label="taxPercent" name="taxPercent" value={row.taxPercent } onChange={(e)=>handlePercentInputChange(e,i)} ></TextField>
                  </StyledTableCell>   

                 

               {/* {tax._id !== row._id && <TableCell align="center"><EditOutlinedIcon style={{cursor:"pointer"}} onClick={()=>handleEdit(row,i)}/></TableCell>}
                  {tax._id === row._id && <TableCell align="center">
                  <ReplayOutlinedIcon style={{cursor:"pointer"}} onClick={handleUndo}/>
                    <SaveOutlinedIcon style={{cursor:"pointer"}} onClick={()=>handleUpdate,i}/>
                  </TableCell>}   */}
            
                  </TableRow>
              
          ))}
        </TableBody>
        {/* <div style={{position:"relative",right:"-1070px",backgroundColor:"#0088bc",color:'white'}}>
        <Button  variant="contained"  onClick={handleUpdate}>Save</Button>
        </div> */}

          <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#0088bc",color:'white',position:"relative",right:"-1300px"}} onClick={handleUpdate}> SAVE </Button>

        {/* <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#0088bc",color:'white',position:"relative",right:"-1000px"}} onClick={handleUndo}> RESTORE </Button>
                 */}
      </Table>
    </TableContainer>
   



   
    </React.Fragment>
  );
};

export default Taxes;
