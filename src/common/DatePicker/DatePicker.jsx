import "moment";
import React from "react";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DatePicker ,DateTimePicker} from "@material-ui/pickers";

import styles from "./DatePickerStyle";

const CustomDatePicker = ({ label, onChange, error, ...props }) => {
  const classes = styles(props);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        error={error && true}
        className={classes.root}
        disableToolbar
        variant="inline"
        format="DD/MM/YYYY,HH:MM"
        margin="normal"
        id={label}
        label={label}
        onChange={event => onChange(event, props.id)}
        helperText={error}
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
};

export default CustomDatePicker;
