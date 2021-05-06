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
import { grey, black, blue } from "@material-ui/core/colors";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import constants from "../../utils/constants";

const { success, error } = constants.snackbarVariants;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#0088bc",
    color: theme.palette.common.white,
  },
  body: {
    fontWeight: "bold",
    width: "10%"
  }


}))(TableCell);

const useStyles = makeStyles(theme => ({

  inputItems: {
    width: "10%"
  },
  span: {
    color: "#0088bc"
  },
  table: {
    maxWidth: 1200,
    maxHeight: "70vh"
  },
  roomsDiv:{
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));

const Taxes = ({ onSnackbarEvent }) => {
  const classes = useStyles();
  const [taxSlabs, setTaxSlabs] = useState(null);
  const [sam, setsam] = useState([]);
  const [tax, setTax] = useState([]);
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

  const handleInputChange = (e, i) => {
    const slab = [...taxSlabs]
    slab[i].lessThanAndEqual = Number(e.target.value)
    slab[i + 1].greaterThan = Number(e.target.value) + 1
    setTaxSlabs(slab)
  }

  const handleNameChange = (e) => {
    const slab = [...taxSlabs]
    slab[3].name = e.target.value
    setTaxSlabs(slab)
  }

  const handleCheckBoxChange = (e) =>{
    console.log("e.checked",e.target.checked)
    const slab = [...taxSlabs]
    slab[3].active = e.target.checked
    setTaxSlabs(slab)
  }

  const handlePercentInputChange = (e, i) => {
    const slab = [...taxSlabs]
    slab[i].taxPercent = Number(e.target.value).toFixed(2)
    setTaxSlabs(slab)
  }


  const handleEdit = (row, i) => {
    console.log("taxEdit", row, i)
    setTax(row, i)

  }

  const handleUndo = () => {
    setTax({})
  }

  const handleUpdate = async () => {

    const promises = []
    taxSlabs.forEach(el => {
      promises.push(taxService.updatetaxDetails(el))
    })
    setLoading(true);
    Promise.all(promises)
      .then(res => {
        openSnackBar("Tax Updated Successfully", success);
        console.log("promiseAll res", res)
      })
      .catch((err) => {
        console.log(err)
      })
      .then(()=>{
        setLoading(false);
      })

  }

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    onSnackbarEvent(snakbarObj);
  };

  return (
    <React.Fragment>
      <DialogTitle>Tax Calculation</DialogTitle>
      {loading && <Loader color="#0088bc" />}
      <DialogContent className={classes.roomsDiv}>
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} aria-label="simple table"  >
            <TableHead>
              <TableRow>
                <StyledTableCell rowSpan={2} align="center">Active</StyledTableCell>
                <StyledTableCell rowSpan={2} align="center">TAX</StyledTableCell>
                {/* <StyledTableCell rowSpan={2} align="center">UNIT</StyledTableCell> */}
                <StyledTableCell colSpan={2} align="center" >PRICE RANGE</StyledTableCell>
                <StyledTableCell rowSpan={2} align="center">VALUE in %</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">RATE FROM</StyledTableCell>
                <StyledTableCell align="center">RATE TO</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {taxSlabs && taxSlabs.slice(0,3).map((row, i) => (
                <TableRow key={row._id} >
                  
                  {i===0 && <StyledTableCell align="center" rowSpan={3}>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={true}
                          name="active"
                          color="primary"
                          disabled
                        />
                      }
                      label="Active"
                      ></FormControlLabel>
                  </FormControl>
                </StyledTableCell>}
                  {i===0 && <StyledTableCell align="center" rowSpan={3}><TextField style={{ position: "relative", width: "40%"}}
                    variant="outlined" value="GST" disabled="true" ></TextField>
                  </StyledTableCell>}
                  {/* {i===0 && <StyledTableCell align="center" rowSpan={3} ><TextField style={{ position: "relative", width: "40%" }}
                    variant="outlined" value="%" disabled="true"></TextField>
                  </StyledTableCell>} */}
                  <StyledTableCell align="center">
                    <TextField style={{ position: "relative", width: "40%" }}
                      variant="outlined" disabled="true" value={row.greaterThan} />
                  </StyledTableCell>
                  {i !== 2 && <StyledTableCell align="center">
                    <TextField style={{ position: "relative", width: "40%" }}
                      variant="outlined" type="number" inputProps={{ min: 0, max: 100 }} name="lessThanAndEqual" value={row.lessThanAndEqual} onChange={(e) => handleInputChange(e, i)} ></TextField>
                  </StyledTableCell>}
                  {i === 2 && <StyledTableCell align="center"></StyledTableCell>}
                  <StyledTableCell align="center">
                      <TextField style={{ position: "relative", width: "40%" }}
                        variant="outlined" type="number" inputProps={{ min: 0, max: 100, step:.01 }}name="taxPercent" value={row.taxPercent} onChange={(e) => handlePercentInputChange(e, i)} ></TextField>
                  </StyledTableCell>
                </TableRow>

              ))}
              <TableRow>
                <StyledTableCell align="center">
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={taxSlabs && taxSlabs[3] && taxSlabs[3].active}
                          onChange={handleCheckBoxChange}
                          name="active"
                          color="primary"
                        />
                      }
                      label="Active"
                      ></FormControlLabel>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <TextField 
                    name="name"
                    style={{ position: "relative", width: "40%"}}
                    variant="outlined" 
                    value={taxSlabs && taxSlabs[3] && taxSlabs[3].name} 
                    onChange={handleNameChange}
                  />
                </StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell align="center">
                  <TextField 
                    style={{ position: "relative", width: "40%" }}
                    variant="outlined" 
                    type="number" 
                    inputProps={{ min: 0, max: 100, step:.01 }}
                    name="taxPercent" 
                    value={taxSlabs && taxSlabs[3] && taxSlabs[3].taxPercent} 
                    onChange={(e) => handlePercentInputChange(e, 3)} 
                  />
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#0088bc", color: 'white'}} 
                    onClick={handleUpdate}
                  > 
                    SAVE 
                  </Button>
                </StyledTableCell>
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
      </DialogContent>
    </React.Fragment>
  );
};

export default Taxes;
