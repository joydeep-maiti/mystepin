import React from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "./../../common/Checkbox/Checkbox";
import FormUtils from "../../utils/formUtils";

const useStyles = makeStyles(theme => ({
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  input: { width: "40%" },
  paymentMethods: {
    display: "flex"
  },
  checkbox: {
    marginTop: 20
  },
  inputItems: {
    width: "30%"
  },
  button: {
    textAlign: "right"
  },
  radioGroup: {
    marginBottom: 20
  }
}));

const BillingForm = props => {
  const classes = useStyles();
  const {
    onFormSubmit,
    onInputChange,
    onCheckboxChange,
    onRadioGroupChange,
    data,
    errors,
    booking,
    payment
  } = props;

  console.log("booking",booking)

  const [postotal, setPosTotal] = React.useState(0)

  React.useEffect(()=>{
    if(!booking.pos) 
      return
    let expense = 0
    Object.keys(booking.pos).forEach(el=>{
      debugger
      booking.pos[el].forEach(e =>{
        expense += Number(e.amount)
      })
    })
    setPosTotal(expense)
  },[booking])

  const renderInputItems = (label, value, inputId) => {
    return (
      <div className={classes.formGroup}>
        <Typography
          display={"block"}
          nowrap={"true"}
          className={classes.inputItems}
        >
          {label}
        </Typography>
        <Typography>:</Typography>
        <div style={{ width: "50%" }}>
          {FormUtils.renderInput({
            id: inputId,
            label: null,
            type: "number",
            value: value || "",
            onChange: () => {},
            error: null,
            disabled: true
          })}
        </div>
      </div>
    );
  };

  const renderPaymentMethods = (
    label,
    inputId,
    value,
    onInputChange,
    onCheckboxChange,
    error,
    disabled,
    checked
  ) => {
    return (
      <div className={classes.formGroup}>
        <Checkbox
          className={classes.checkbox}
          name={inputId}
          onChange={onCheckboxChange}
          checked={checked}
        />
        {FormUtils.renderInput({
          id: inputId,
          label: label,
          type: "number",
          value: value,
          onChange: onInputChange,
          error: !disabled && error,
          disabled: disabled
        })}
      </div>
    );
  };

  const radioButtons = [
    { value: "withoutTax", label: "Without Tax" },
    { value: "withTax", label: "With Tax" }
  ];

  return (
    booking && (
      <form onSubmit={event => onFormSubmit(event)}>
        <div className={classes.radioGroup}>
          {FormUtils.renderRadioGroup({
            label: "",
            ariaLabel: "taxInfo",
            name: "tax",
            value: data.taxStatus,
            onChange: onRadioGroupChange,
            radioButtons
          })}
        </div>
        <div>
          {renderInputItems("Room Charges", booking.roomCharges, "roomCharges")}
          {renderInputItems("Advance", booking.advance, "advance")}
          {renderInputItems("Misllaneous", postotal, "misllaneous")}
          {renderInputItems("Balance", booking.balance, "balance")}
        </div>
        {/* <Divider className={classes.divider} /> */}
        <div className={classes.paymentMethods}>
          {renderPaymentMethods(
            "Cash Payment",
            "cash",
            data.cash,
            onInputChange,
            onCheckboxChange,
            errors.cash,
            payment.cash.disable,
            payment.cash.checked
          )}
          {renderPaymentMethods(
            "Card Payment",
            "card",
            data.card,
            onInputChange,
            onCheckboxChange,
            errors.card,
            payment.card.disable,
            payment.card.checked
          )}
          {renderPaymentMethods(
            "Wallet Payment",
            "wallet",
            data.wallet,
            onInputChange,
            onCheckboxChange,
            errors.wallet,
            payment.wallet.disable,
            payment.wallet.checked
          )}
        </div>
        {errors.customError && (
          <div style={{ color: "#f44336" }}>
            <p>{errors.customError}</p>
          </div>
        )}

        <div className={classes.button}>
          {FormUtils.renderButton({
            type: "submit",
            size: "large",
            label: "Submit",
            color: "primary",
            className: null,
            disabled: Object.keys(errors).length ? true : false,
            onClick: () => {}
          })}
        </div>
      </form>
    )
  );
};

export default BillingForm;
