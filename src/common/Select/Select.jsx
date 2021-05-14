import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

import styles from "./SelectStyle";

const Select = ({ options, onChange, error, ...props }) => {
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
        },
        renderValue:props.renderValue
      }}
      margin="normal"
      {...props}
      helperText={error}
    >
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Select;
