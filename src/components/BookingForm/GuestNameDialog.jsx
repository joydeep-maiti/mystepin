import React,{useState} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import useStyles from "./BookingFormStyle";
import FormUtils from "../../utils/formUtils";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { IconButton,Button,Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";
import Input from '@material-ui/core/Input';
import './Guest.css'
import TextField from '@material-ui/core/TextField';
const GuestNameDialog = (props) =>  {
  const classes = useStyles();
  const { onClose, selectedValue, open ,shouldDisable} = props;
  const handleClose = () => {
    onClose(selectedValue);
  };
  let [expanded] = React.useState("panel1");

  const [guest,setGuest] = useState({
    firstName:"",lastName:"",gender:"",idProof:""
  })
  const [guests,setGuests] = useState([]);

  const handleEnterGuest = () =>{
    setGuests(guest)
    console.log("Updated Data",guests)
  }
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="lg">
      <div className={classes.panel}>
           <ExpansionPanel
              expanded={expanded === "panel1"}
             >
                <h3 className="heading">Add Guest</h3>
          <div className="form-g">
          <Grid container direction={"row"} spacing={5}>
               <Grid item>
                    <TextField id="standard-basic" label="First Name" variant="outlined"  required size="small"
                     value={guest.firstName}  onChange={(event)=>setGuest({...guest,firstName:event.target.value})}/>
              </Grid>
              <Grid item>
                   <TextField id="standard-basic" label="Last Name" variant="outlined"  required size="small"
                    value={guest.lastName}  onChange={(event)=>setGuest({...guest,lastName:event.target.value})}/>
              </Grid>
              <Grid item>
                       <TextField id="standard-basic" label="Gender" variant="outlined" required size="small"
                       value={guest.gender}  onChange={(event)=>setGuest({...guest,gender:event.target.value})} />
               </Grid>
              <Grid item>
                    <TextField id="standard-basic" label="Id Proof" variant="outlined"required size="small"
                     value={guest.idProof}  onChange={(event)=>setGuest({...guest,idProof:event.target.value})}  />
               </Grid>
               <Grid item>
               <Button variant="contained" color="primary" component="span" onClick={handleEnterGuest} >
                    Add Guest
               </Button>  
               </Grid>
              </Grid>
          </div>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            { guests && guests.map((guest, index) => {
              return (
                <div key={`room-${index}}`} className="form-group">
                <Grid container direction={"row"} spacing={5}>
                <Grid item>
                <TextField id="standard-basic" label="First Name" variant="outlined"  required size="small"
                value={guest.firstName}  disabled/>
                </Grid>
                <Grid item>
                <TextField id="standard-basic" label="Last Name" variant="outlined"  required size="small"
                value={guest.lastName}  disabled/>
                </Grid>
                <Grid item>
                <TextField id="standard-basic" label="Gender" variant="outlined" required size="small"
                value={guest.gender}  disabled/>
                </Grid>
                <Grid item>
                <TextField id="standard-basic" label="Id Proof" variant="outlined"required size="small"
                value={guest.idProof}  disabled  />
                </Grid>
                <Grid item>
                <IconButton
                color="secondary"
                className={classes.deleteButton}
                //  onClick={() => onDeleteRoom(index)}
                disabled={0 === 0 ? true : shouldDisable}
                >
                <DeleteIcon />
                </IconButton>  
                </Grid>
                </Grid>      
                </div>
                );
              })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </Dialog>
  );
}

export default GuestNameDialog;