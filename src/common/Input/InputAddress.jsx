import React from "react";
import TextField from "@material-ui/core/TextField";

import styles from "./InputStyle";

const InputAddress = ({ onChange, error, ...props }) => {
  const classes = styles(props);
  return (
    <TextField
      error={error && true}
      {...props}
      onChange={event => onChange(event)}
      className={classes.input}
      margin="normal"
      helperText={error}
      multiline
    />
  );
};

export default InputAddress;
