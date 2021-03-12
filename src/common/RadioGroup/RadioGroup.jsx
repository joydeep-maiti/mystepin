import React from "react";
import PropTypes from "prop-types";
import { FormControl, FormLabel, FormControlLabel } from "@material-ui/core";
import {Radio , RadioGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  formGroup: props =>
    props.formGroupClass || {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
});

const CustomRadioGroup = props => {
  const classes = useStyles(props);

  const { label, ariaLabel, name, value, onChange, radioButtons } = props;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={ariaLabel}
        name={name}
        value={value}
        onChange={event => onChange(event)}
      >
        <div className={classes.formGroup}>
          {radioButtons.map(radio => (
            <FormControlLabel
              key={radio.value}
              value={radio.value}
              control={<Radio/>}
              label={radio.label}
            />
          ))}
        </div>
      </RadioGroup>
    </FormControl>
  );
};

CustomRadioGroup.prototype = {
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  formGroupClass: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  radioButtons: PropTypes.array.isRequired
};

export default CustomRadioGroup;
