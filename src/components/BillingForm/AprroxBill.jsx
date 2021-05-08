import React from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "../../common/Checkbox/Checkbox";
import FormUtils from "../../utils/formUtils";
import taxService from "../../services/taxService";
import moment from 'moment';
import posService from "../../services/posService";

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
    width: "40%",
    display:"flex"
  },
  button: {
    textAlign: "right",
    marginTop:"3rem"
  },
  radioGroup: {
    marginBottom: 20,
    marginTop: 20,
    textAlign:"end"
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
  pricetable:{
    width:"100%",
    textAlign:"center"
  },
  pricetableTd: {
    padding:"8px",
    fontSize:"15px"
  },
  closeBtn : {
    marginRight:"1rem"
  }
}));

const ApproxBill = props => {
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
    handleOnClose,
    advanceAmount
  } = props;

  console.log("booking",booking)

  const [rooms, setRooms] = React.useState("");
  const [dayWiseRates, setDayWiseRates] = React.useState({});
  const [postotal, setPosTotal] = React.useState(0)
  const [balance, setBalance] = React.useState(0)
  const [pos, setPos] = React.useState(null)
  const [loading, setLoading] = React.useState(false);
  React.useEffect(()=>{
    const bookedRooms = booking.rooms && booking.rooms.map(el=>el.roomNumber)
    if(bookedRooms)
      setRooms(bookedRooms.toString())
    formatDayWiseBookingRates()
  },[booking])
  
  const formatDayWiseBookingRates= ()=> {

    let dayWiseBookingRates = {}
    console.log("dayWiseRates B",booking.roomWiseRatesForBooking)
    booking.roomWiseRatesForBooking && booking.roomWiseRatesForBooking.map(el=>{            
      el.rates.map(rate=>{
       if(!dayWiseBookingRates[rate.date]){
        dayWiseBookingRates[rate.date] = []
       }
       dayWiseBookingRates[rate.date].push({
         ...rate,
         roomNumber:el.roomNumber
       })
      })
    })
    setDayWiseRates(dayWiseBookingRates)
    console.log("dayWiseRates",dayWiseBookingRates)
  }

  const radioButtons = [
    { value: "withoutTax", label: "Without Tax" },
    { value: "withTax", label: "With Tax" }
  ];
  let total = 0

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

  React.useEffect(()=>{
    fetchPos()
  },[booking._id,data.totalRoomCharges])

  React.useEffect(()=>{
    if(advanceAmount){
      // console.log("postotal", postotal,advanceAmount)
      setBalance(Number(Number(data.totalRoomCharges)+Number(postotal)-Number(advanceAmount)).toFixed(2))
    }
  },[advanceAmount, postotal])
 
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
    // setBalance(Number(Number(data.totalRoomCharges)+Number(expense)-Number(advanceAmount)).toFixed(2))
  }


  return (
    booking && (
      <form onSubmit={event => onFormSubmit(event)}>
        <table width="100%">
          <tr>
            <td className={classes.tableTDTitle}>Name of Guest</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?booking.firstName+" "+booking.lastName:""}</td>

            <td className={classes.tableTDTitle}>Room Nos</td>
            <td>:</td>
            <td className={classes.tableTDesc} colSpan="4">{rooms}</td>
          </tr>
          <tr>
            <td className={classes.tableTDTitle}>Chckin Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkIn).format('D.MMM.YYYY'):""}</td>

            <td className={classes.tableTDTitle}>Checkout Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkOut).format('D.MMM.YYYY'):""}</td>
            <td className={classes.tableTDTitle}>No of Nights</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?booking.nights:1}</td>

          </tr>
        </table>
        <div style={{display:"flex", flexWrap:"wrap", marginTop:"1rem"}}>
          {renderInputItems("Room Charges", booking.flatRoomRate?(Number(data.totalRoomCharges)-Number(data.tax)).toFixed(2):booking.roomCharges, "roomCharges")}
          {renderInputItems("Tax", data.tax, "tax")}
          {renderInputItems("Misllaneous", postotal, "misllaneous")}
          {renderInputItems("Total Charges", data.totalRoomCharges, "totalRoomCharges")}
          {renderInputItems("Advance", advanceAmount, "advance")}
          {renderInputItems("Balance",  balance, "balance")}
        </div>
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
        <div style={{maxHeight:"25rem",overflowY:"auto", marginTop:"1rem"}}>
          <table className={classes.pricetable}>
            <tr style={{background:"antiquewhite", padding:"3px 5px"}}>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Date</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Room No.</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Room Rate</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Tax Rate</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Tax</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Total</th>
            </tr>
              {
                dayWiseRates && Object.keys(dayWiseRates).map((date,i)=>{
                  let dayTotal = 0;
                  return dayWiseRates[date].map((rate,index)=>{
                    const taxAmount = Number(rate.tax).toFixed(2);
                    let roomDayTotal = data.taxStatus==="withTax"?Number(rate.rate)+Number(taxAmount):Number(rate.rate)
                    dayTotal += roomDayTotal;

                    return (
                      <React.Fragment>
                        <tr>
                          <td className={classes.pricetableTd}>{moment(rate.date).format('D.MMM.YYYY')}</td>
                          <td className={classes.pricetableTd}>{rate.roomNumber}</td>
                          <td className={classes.pricetableTd}>{rate.rate}</td>
                          <td className={classes.pricetableTd}>{rate.taxPercent+"%"}</td>
                          <td className={classes.pricetableTd}>{data.taxStatus==="withTax"?taxAmount:0}</td>
                          <td className={classes.pricetableTd}>{(roomDayTotal).toFixed(2)}</td>
                        </tr>
                        {
                          index === dayWiseRates[date].length-1 && 
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th style={{paddingBottom:".5rem", fontSize:"15px", fontWeight:600}}>Day Total</th>
                              <th style={{paddingBottom:".5rem", fontSize:"15px", fontWeight:600}}>{(dayTotal).toFixed(2)}</th>
                            </tr>
                        }
                      </React.Fragment>
                    )
                  })
                      
                })
              }
          </table>
        </div>
        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <h3 style={{margin:"8px 1rem"}}>Total</h3>
          <h3 style={{margin:"8px 1rem"}}>{data.totalRoomCharges}</h3>
        </div>
        {errors.customError && (
          <div style={{ color: "#f44336" }}>
            <p>{errors.customError}</p>
          </div>
        )}

        <div className={classes.button}>
          {FormUtils.renderButton({
            size: "large",
            label: "Close",
            color: "secondary",
            className: classes.closeBtn,
            disabled: Object.keys(errors).length ? true : false,
            onClick: handleOnClose,
          })}
          {/* {FormUtils.renderButton({
            type: "submit",
            size: "large",
            label: "Continue",
            color: "primary",
            className: null,
            disabled: Object.keys(errors).length ? true : false,
            onClick: () => {}
          })} */}
        </div>
      </form>
    )
  );
};

export default ApproxBill;
