import React,{useState,useEffect} from 'react'
import { makeStyles, Button,InputLabel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import './Occupancy.css'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 2
  },
  buttons:{
    marginTop: 20
  }
}));
const Occupancy = () => {
  const [occupancyCategory,setOccupancyCategory]=useState("");

  useEffect(()=>{
    
       console.log(occupancyCategory) ;
    

  },[occupancyCategory])

    const classes = useStyles();
    return (
      <div>
        <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
         Occupancy
        </Typography>
        </div>

        <div className="container">   
      <div className="formdates">  
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
       <KeyboardDatePicker
            disableToolbar
            format="MM/dd/yyyy"
           margin="normal"
           id="date-picker-dialog"
          label="From"
          //value={currentDate}              
          //onChange={handleDateChange}
          KeyboardButtonProps={{
           'aria-label': 'change date',
          }}
         style={{ marginRight: "2rem",width:'150px'}}
           />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils} 
                        style={{ marginLeft: "1rem"}}>
       <KeyboardDatePicker
            disableToolbar
            format="MM/dd/yyyy"
           margin="normal"
           id="date-picker-dialog"
          label="To"
          //value={currentDate}              
          //onChange={handleDateChange}
          KeyboardButtonProps={{
           'aria-label': 'change date',
          }}
         style={{ marginLeft: "0.5rem",width:'150px'}}
                          />
          </MuiPickersUtilsProvider>
          </div>  
          <div className="occupancyselect">
          <InputLabel id="label">Select Category to Generate Report on Occupancy </InputLabel>
          <select name="occupancy" id="occupancycategory" onChange={(e)=>{setOccupancyCategory(e.target.value)}}>
          <option value=""></option>            
          <option value="bookingsummary">Billing Summary</option>
          <option value="due">Due</option>
          <option value="settlement">Settlement</option>
          </select>
          </div> 
          <div className="buttoncontainer"> 
          <Button type="submit"  className="button1">
          Back
        </Button>
        <Button  type="submit" className="button2">
          Generate
        </Button>
          </div>
        </div>

      </div>
    )
}

export default Occupancy
