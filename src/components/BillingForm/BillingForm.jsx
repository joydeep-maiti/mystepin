import React from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "./../../common/Checkbox/Checkbox";
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
    alignItems: "flex-start"
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
    payment,
    onChangeData,
    due,
    advanceAmount
  } = props;

  console.log("booking",booking)
  console.log("data",data)
  
  const [postotal, setPosTotal] = React.useState(0)
  const [pos, setPos] = React.useState(null)
  // const [roomChargesTotal, setRoomChargesTotal] = React.useState(0)
  // const [roomChargesTotalWithTax, setRoomChargesTotalWithTax] = React.useState(0)
 const [taxSlabs, setTaxSlabs] = React.useState(0)
  // const [slab, setSlab] = React.useState(0)
  const [balance, setBalance] = React.useState(0)
  // const [taxSlabs, setTaxSlabs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [billingst,setBillingst] = React.useState("Due");
  const[cardnum,setCardnum]=React.useState("");
  const[wallet,setWallet]=React.useState("");  
  const [rooms, setRooms] = React.useState("");
  React.useEffect(()=>{
    const bookedRooms = booking.rooms && booking.rooms.map(el=>el.roomNumber)
    if(bookedRooms)
      setRooms(bookedRooms.toString())
  },[booking])

  React.useEffect(async()=>{
    const data = await taxService.getTaxSlabs("CITY")
    if(data){

    console.log("Tax-data",data[0].taxPercent)
    setTaxSlabs(data[0].taxPercent)
    }
  },[])
  // const billingStatus=due?[
  //   {label:"Due" ,value:"Due"},
  //   {label:"Bill to Company" ,value:"Bill to Company"},
  // ]:[
  //   {label:"Paid" ,value:"Paid"},
  // ]
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
  const getFullName = booking.firstName+" "+booking.lastName;
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
  React.useEffect(()=>{
    fetchPos()
  },[booking._id,data.totalRoomCharges])

 
  const fetchPos = async()=>{
    setLoading(true)
    const response = await posService.getPosByBookingId(booking._id)
    setLoading(false)
    if(!response) {
      setBalance(Number(Number(data.totalRoomCharges)-Number(advanceAmount)).toFixed(2))
      return
    }
    setPos(response)
    let expense = 0
    Object.keys(response.pos).forEach(el=>{
      // debugger
      response.pos[el].forEach(e =>{
        expense += Number(e.amount)
      })
    })
    setPosTotal(Number(expense).toFixed(2))
    onChangeData({
      posTotal:Number(expense).toFixed(2)
    })
    setBalance(Number(Number(data.totalRoomCharges)+Number(expense)-Number(advanceAmount)).toFixed(2))
  }

  React.useEffect(()=>{
    onChangeData({
      balance: balance,
      posData: pos
    })
    console.log("POSTOATA",postotal)
  },[balance])

  React.useEffect(()=>{
    if(advanceAmount){
      setBalance(Number(Number(data.totalRoomCharges)+Number(postotal)-Number(advanceAmount)).toFixed(2))
    }
  },[advanceAmount])
  // let type = "CITY"
  // const fetchTaxes = async () => {
  //     setLoading(true)
  //     const taxSlabs = await taxService.getTaxSlabs(type);
  //     //console.log(taxSlabs)
  //     setTaxSlabs(taxSlabs);
  //     setLoading(false);
  //   };
  
  //   React.useEffect(()=>{
  //    fetchTaxes()
  //   },[taxSlabs])
  // React.useEffect(()=>{
  //   let balance = data.taxStatus==="withTax"?Number(roomChargesTotalWithTax)-Number(booking.advance):Number(roomChargesTotal)-Number(booking.advance)
  //   setBalance(balance)
  // },[roomChargesTotal,roomChargesTotalWithTax,data.taxStatus])

  // React.useEffect(()=>{
  //   if(roomChargesTotal){
  //     // debugger
  //     const slab = taxSlabs.filter(el => roomChargesTotal>el.greaterThan && roomChargesTotal<= (el.lessThanAndEqual || 9999999999))
  //     if(slab.length>0){
  //       let tax = booking.roomCharges*(slab[0].taxPercent/100)
  //       let chargesWithTax = roomChargesTotal + tax
  //       setRoomChargesTotalWithTax(chargesWithTax)
  //       // setBalance(Number(chargesWithTax)-Number(booking.advance))
  //       setTax(tax)
  //       setSlab(slab[0].taxPercent+"%")
  //     }
  //   }
  // },[taxSlabs,roomChargesTotal])


  // const fetchTaxes = async () => {
  //   setLoading(true)
  //   const taxSlabs = await taxService.getTaxSlabs();
  //   setTaxSlabs(taxSlabs);
  //   setLoading(false);
  // };

  // const renderInputItems = (label, value, inputId) => {
  //   return (
  //     <div className={classes.formGroup}>
  //       <Typography
  //         display={"block"}
  //         nowrap={"true"}
  //         className={classes.inputItems}
  //       >
  //         {label}
  //       </Typography>
  //       <Typography>:</Typography>
  //       <div style={{ width: "50%" }}>
  //         {FormUtils.renderInput({
  //           id: inputId,
  //           label: null,
  //           type: "number",
  //           value: value || "",
  //           onChange: () => {},
  //           error: null,
  //           disabled: true
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  const renderInputItems = (label, value, inputId) => {
    return (
      // <React.Fragment>
      <div style={{ width: "50%", display:"flex",alignItems:"center", marginBottom:"1rem" }}>
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
            value: value || "",
            onChange: () => {},
            error: null,
            disabled: true
          })}
        </div>
      </div>
      // </React.Fragment>
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
//let cityTax =taxSlab
  let cityTax = (Number(postotal)*(parseInt(taxSlabs)/100)).toFixed(2) || 0
  let misc = ((Number(postotal) )+ (Number(postotal)*(parseInt(taxSlabs)/100))).toFixed(2) || 0

  // const radioButtons = [
  //   { value: "withoutTax", label: "Without Tax" },
  //   { value: "withTax", label: "With Tax" }
  // ];

  return (
    booking && (
      <form onSubmit={event => onFormSubmit(event)}>
        {loading && <LoaderDialog open={loading} />}
        <table width="100%">
          <tr>
            <td className={classes.tableTDTitle}>Name of Guest</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?booking.firstName+" "+booking.lastName:""}</td>
          {/* </tr>
          <tr> */}
            <td className={classes.tableTDTitle}>Room Nos</td>
            <td>:</td>
            <td className={classes.tableTDesc} colSpan="4">{rooms}</td>
          </tr>
          <tr>
            <td className={classes.tableTDTitle}>Chckin Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkIn).format('D.MMM.YYYY'):""}</td>
          {/* </tr>
          <tr> */}
            <td className={classes.tableTDTitle}>Checkout Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkOut).format('D.MMM.YYYY'):""}</td>
            <td className={classes.tableTDTitle}>No of Nights</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?booking.nights:0}</td>
          {/* </tr>
          <tr> */}
          </tr>
        </table>
        {/* <div className={classes.radioGroup}>
          {FormUtils.renderRadioGroup({
            label: "",
            ariaLabel: "taxInfo",
            name: "tax",
            value: data.taxStatus,
            onChange: onRadioGroupChange,
            radioButtons
          })}
        </div> */}
        <div style={{display:"flex", flexWrap:"wrap", marginTop:"1rem"}}>
          {renderInputItems("Room Charges", booking.flatRoomRate?(Number(data.totalRoomCharges)-Number(data.tax)).toFixed(2):booking.roomCharges, "roomCharges")}
          {renderInputItems("Tax", data.tax, "tax")}
          {renderInputItems("Misllaneous", misc || '0', "misllaneous")}
          {renderInputItems("City Tax", cityTax|| '0', "cityTax")} {/*get city tax and replace with postotal */}
          {renderInputItems("Total Charges", Number(data.totalRoomCharges)+ Number(misc), "totalRoomCharges")} {/*Add city tax to it */}
          {renderInputItems("Advance", advanceAmount || '0', "advance")}
          {renderInputItems("Balance", Number(balance) + Number(cityTax) , "balance")}
       
        <div style={{width:"20rem",display:"flex", alignItems:"center"}}>
        <label style={{width:"16rem"}}>Billing Status</label>
        <span>:</span>
        {FormUtils.renderBillingStatus({
          id: "billingstatus:",
          name: "billingstatus",
          value: data.billingStatus,
          onChange: event => selectBillingStatus(event),
          billingStatus
        })}
         </div>
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
          <div style={{position:"relative", textAlign:"-webkit-center"}}>
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
            <div  style={{width:"10rem"}}>
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
              "Wallet/UPI Payment",
              "wallet",
              data.wallet,
              onInputChange,
              onCheckboxChange,
              errors.wallet,
              payment.wallet.disable,
              payment.wallet.checked
            )}
            <div style={{width:"10rem"}}>
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
