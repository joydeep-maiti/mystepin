import React from 'react'
import { makeStyles, Button,Grid,Container} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
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

const BillingDetails = () => {
    const classes = useStyles();
    return (
        <div>
        <div className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Billing Details
            </Typography>
        </div>
       < Container maxWidth='sm'>
        <Grid 
          alignItems="center"
          justify="center">
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

            <div className={classes.buttons}> 
            <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#0088bc",color:'white'}}
            >
            Back
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#0088bc",color:'white',marginLeft:'5rem'}}
            >
            Generate
          </Button>
            </div>
            </Grid>
            </Container>
        </div>
    )
}

export default BillingDetails
