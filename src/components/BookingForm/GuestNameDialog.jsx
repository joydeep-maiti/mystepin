import React, { useState } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import useStyles from "./BookingFormStyle";
import FormUtils from "../../utils/formUtils";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { IconButton, Button, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";
import Input from '@material-ui/core/Input';
import './Guest.css'
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const GuestNameDialog = (props) => {
  const classes = useStyles();
  const { onClose, selectedValue, open, shouldDisable, onHandleGuest, additionalGuests } = props;

  

  const handleClose = () => {
    onClose(selectedValue);
  };
  let [expanded] = React.useState("panel1");

  const [guest, setGuest] = useState({
    firstName: "", lastName: "", gender: "", Idproof: ""
  })
  const [guests, setGuests] = useState([]);
  const genders = [
    {label:"Male", value:"Male"},
    {label:"Female", value:"Female"},
    {label:"Other", value:"Other"}
  ]

  React.useEffect(()=>{
    if(additionalGuests && additionalGuests.length>1){
      console.log("additionalGuests before", additionalGuests)
      let _guests = additionalGuests.slice(1,additionalGuests.length)
      console.log("additionalGuests inset", _guests)
      setGuests(_guests)
    }else{
      setGuests([])
    }
  },[additionalGuests])

  const handleEnterGuest = (e) => {
    e.preventDefault();
    const _guests = [...guests]
    _guests.push(guest)
    console.log("Updated Data", _guests)
    setGuests(_guests)
    setGuest({
      firstName: "", lastName: "", gender: "", Idproof: ""
    })
    // setGuest({})
  }

  const handleDelete = (index) => {
    console.log("el",index)
    let _guests = [...guests]
    console.log("additionalGuests delete", _guests)
    _guests.splice(index,1)
    console.log("additionalGuests delete", _guests)
    setGuests(_guests)
  }

  const handleDone = (el) => {
    handleClose()
    onHandleGuest(guests)
  }

  console.log("additionalGuests",guests)

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="lg">
      <h3 className="heading">Additional Guest</h3>
      <form className="form-g" autoComplete="off" onSubmit={handleEnterGuest} style={{margin: "0.7rem auto"}}>
        <Grid container direction={"row"} spacing={2} justify='center'>
          <Grid item>
            <TextField id="standard-basic" label="First Name" variant="outlined" required size="small"
              value={guest.firstName} onChange={(event) => setGuest({ ...guest, firstName: event.target.value })} style={{width:"10rem"}}/>
          </Grid>
          <Grid item>
            <TextField id="standard-basic" label="Last Name" variant="outlined" required size="small"
              value={guest.lastName} onChange={(event) => setGuest({ ...guest, lastName: event.target.value })}  style={{width:"10rem"}}/>
          </Grid>
          <Grid item>
            <TextField id="standard-basic" select label="Gender" variant="outlined" required size="small"
              value={guest.gender} onChange={(event) => setGuest({ ...guest, gender: event.target.value })}  style={{width:"10rem"}}
            >
              {genders.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
            </TextField>
          </Grid> 
          <Grid item>
            <TextField id="standard-basic" label="Id Proof" variant="outlined" required size="small"
              value={guest.Idproof} onChange={(event) => setGuest({ ...guest, Idproof: event.target.value })}  style={{width:"10rem"}}/>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Add Guest
            </Button>
          </Grid>
        </Grid>
      </form>
      {guests && guests.length>0 && <TableContainer component={Paper} style={{width:"90%", margin: "0.7rem auto"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Sl No.</TableCell>
              <TableCell align="center">Guest Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">ID Proof</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            guests.map((guest, index) => {
              return (
                  <TableRow>
                    <TableCell align="center">{index+1}</TableCell>
                    <TableCell align="center">{`${guest.firstName} ${guest.lastName}`}</TableCell>
                    <TableCell align="center">{guest.gender}</TableCell>
                    <TableCell align="center">{guest.Idproof}</TableCell>
                    <TableCell align="center"><DeleteOutlineOutlinedIcon style={{ cursor: "pointer" }} onClick={() => handleDelete(index)} /></TableCell>
                  </TableRow>
              )
            })
          }
          </TableBody>
        </Table>
      </TableContainer>}
      <DialogActions style={{paddingRight:"2rem"}}>
        <Button onClick={onClose} color="secondary" variant="contained">
          Close
        </Button>
        <Button color="primary" variant="contained" onClick={handleDone}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GuestNameDialog;