import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

import styles from "./SelectStyle";

const Select6 = ({ nationalityOptions, onChange, error, value, ...props }) => {
  const classes = styles();
  return (
    <TextField
      error={error && true}
      select
      value={value}
      onChange={event => onChange(event)}
      className={classes.inputNationality}
      SelectProps={{
        MenuProps: {
          className: classes.menu
        }
      }}
      margin="normal"
      {...props}
      helperText={error}
    >
      {nationalityOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
</TextField>
  );
};

export default Select6;
