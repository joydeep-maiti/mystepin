import React from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "../../common/Checkbox/Checkbox";
import FormUtils from "../../utils/formUtils";
import taxService from "../../services/taxService";
import posService from "../../services/posService";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";
import TextField from '@material-ui/core/TextField';
import { YearSelection } from "@material-ui/pickers/views/Year/YearView";
import { InputLabel} from "@material-ui/core";
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  input: { width: "40%" },
  paymentMethods: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom:"1rem"
  },
  checkbox: {
    marginTop: 20
  },
  inputItems: {
    width: "40%",
    display:"flex"
  },
  button: {
    textAlign: "right"
  },
  radioGroup: {
    marginBottom: 20
  },
  tableTDTitle:{
    fontWeight:600,
    padding:".5rem 0",
    fontSize:"15px",
    width:"7rem"
  },
  tableTDesc:{
    padding:".5rem 0",
    fontSize:"15px",

  },
}));

const BillingSettlementForm = props => {
  const classes = useStyles();
  const {
    onFormSubmit,
    onInputChange,
    onCheckboxChange,
    data,
    errors,
    payment,
    onChangeData,
  } = props;

  // console.log("booking",booking)
  // console.log("data",data)
  
  const[cardnum,setCardnum]=React.useState("");
  const[wallet,setWallet]=React.useState("");  



  const billingStatus = [
    {label:"Due" ,value:"Due"},
    {label:"Bill to Company" ,value:"Bill to Company"},
    {label:"Paid" ,value:"Paid"},
  ]

  const walletList =[
      {label:"PhonePe" ,value:"Phonepe"},
      {label:"GooglePay" ,value:"GooglePay"},
      {label:"Paytm" ,value:"Paytm"},
      {label:"Others" ,value:"others"}
  ]

  const handleCardNum = (event)=>{
    // console.log(typeof event.target.value)
    setCardnum(event.target.value.slice(0,4))
    onChangeData({cardNum:event.target.value.slice(0,4)})
  }
  const selectBillingStatus = (event) => {
    onChangeData({
      billingStatus:event.target.value
    })
  }
  const selectwalletStatus = (event) => {
    setWallet(event.target.value)
    onChangeData({walletType:event.target.value})
  }



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


  return (
      <React.Fragment>
      {/* <form> */}
        {/* <div style={{width:"20rem",display:"flex", alignItems:"center"}}>
          <label style={{width:"16rem"}}>Billing Status</label>
          <span>:</span>
          {FormUtils.renderBillingStatus({
            id: "billingstatus:",
            name: "billingstatus",
            value: data.billingStatus,
            onChange: event => selectBillingStatus(event),
            billingStatus
          })}
        </div> */}
        {/* <Divider className={classes.divider} /> */}
        <div className={classes.paymentMethods}>
          {renderPaymentMethods(
            "Cash",
            "cash",
            data.cash,
            onInputChange,
            onCheckboxChange,
            errors.cash,
            payment.cash.disable,
            payment.cash.checked
          )}
          <div style={{position:"relative", textAlign:"-webkit-center"}}>
            {renderPaymentMethods(
              "Card",
              "card",
              data.card,
              onInputChange,
              onCheckboxChange,
              errors.card,
              payment.card.disable,
              payment.card.checked
            )}
            <div  style={{width:"8rem"}}>
                {payment.card.checked && 
                <TextField
                  required
                  id="card-num" 
                  label="last 4 digits" 
                  type="number"
                  inputProps={{ max: 9999}}
                  value={cardnum}  
                  onChange={handleCardNum}>
                </TextField>
                }
            </div>
          </div>
          <div style={{position:"relative", textAlign:"-webkit-center",marginBottom:"2rem"}}>
            {renderPaymentMethods(
              "Wallet/UPI",
              "wallet",
              data.wallet,
              onInputChange,
              onCheckboxChange,
              errors.wallet,
              payment.wallet.disable,
              payment.wallet.checked
            )}
            <div style={{width:"8rem"}}>
              {payment.wallet.checked && FormUtils.renderCardStatus({
                id: "Walletstatus",
                name: "Walletstatus",
                label: "Choose type",
                value: wallet,
                required:true,
                onChange: event => selectwalletStatus(event),
                walletList
              })}
              </div>
          </div>
        </div>
        <div style={{display:"flex"}}>
        
       
      </div>
        {errors.customError && (
          <div style={{ color: "#f44336" }}>
            <p>{errors.customError}</p>
          </div>
        )}

        {/* <div className={classes.button}>
          {FormUtils.renderButton({
            type: "submit",
            size: "large",
            label: "Submit",
            color: "primary",
            className: null,
            disabled: Object.keys(errors).length ? true : false,
            onClick: () => {}
          })}
        </div> */}
      {/* </form> */}
      </React.Fragment>
  );
};

export default BillingSettlementForm;
