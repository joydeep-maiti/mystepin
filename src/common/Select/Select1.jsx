import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

import styles from "./SelectStyle";

const Select1 = ({ options1, onChange, error, ...props }) => {
  const classes = styles();
  return (
    <TextField
      error={error && true}
      select
      onChange={event => onChange(event)}
      className={classes.input}
      SelectProps={{
        MenuProps: {
          className: classes.menu
        }
      }}
      margin="normal"
      {...props}
      helperText={error}
    >
      {options1.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}


      
    </TextField>
  );
};

export default Select1;
