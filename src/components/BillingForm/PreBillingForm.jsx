import React from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "../../common/Checkbox/Checkbox";
import FormUtils from "../../utils/formUtils";
import taxService from "../../services/taxService";
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
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

const PreBillingForm = props => {
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
    handleOnClose
  } = props;

  console.log("booking",booking)

  const [rooms, setRooms] = React.useState("");
  const [dayWiseRates, setDayWiseRates] = React.useState({});

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

  return (
    booking && (
      <form onSubmit={event => onFormSubmit(event)}>
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
            <td className={classes.tableTDTitle}>Checkin Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkIn).format('D.MMM.YYYY'):""}</td>
          {/* </tr>
          <tr> */}
            <td className={classes.tableTDTitle}>Checkout Date</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?moment(booking.checkOut).format('D.MMM.YYYY'):""}</td>
            <td className={classes.tableTDTitle}>No of Nights</td>
            <td>:</td>
            <td className={classes.tableTDesc}>{booking?booking.nights:1}</td>
          {/* </tr>
          <tr> */}
          </tr>
        </table>
        <div className={classes.radioGroup}>
          <div>
            <span className={classes.tableTDTitle}>Rate Type: </span><span className={classes.tableTDesc}>{booking.flatRoomRate?`Flat Rate `:`Plus Tax `}</span>
          </div>
          {FormUtils.renderRadioGroup({
            label: "",
            ariaLabel: "taxInfo",
            name: "tax",
            value: data.taxStatus,
            onChange: onRadioGroupChange,
            radioButtons
          })}
        </div>
        {/* <div>
          <table className={classes.pricetable}>
            <tr>
              <th>Date</th>
              <th>Room No.</th>
              <th>Room Rate</th>
              <th>Tax Rate</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
            </table>
        </div> */}
        <div style={{maxHeight:"25rem",overflowY:"auto"}}>
          <table className={classes.pricetable}>
            <tr style={{background:"antiquewhite", padding:"3px 5px"}}>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Date</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Room No.</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Room Rate</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Tax Rate</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Tax</th>
              <th style={{position:"sticky", top:0,background:"antiquewhite", padding:"3px 5px"}}>Total</th>
            </tr>
              {/* {
                booking && booking.roomWiseRatesForBooking && booking.roomWiseRatesForBooking.map(el=>{
                  
                  return el.rates.map(rate=>{
                    const dayTotal = data.taxStatus==="withTax"?Number(rate.rate)+Number(rate.tax):Number(rate.rate);
                    total+=dayTotal;
                    return(
                      <tr>
                        <td className={classes.pricetableTd}>{moment(rate.date).format('D.MMM.YYYY')}</td>
                        <td className={classes.pricetableTd}>{el.roomNumber}</td>
                        <td className={classes.pricetableTd}>{rate.rate}</td>
                        <td className={classes.pricetableTd}>{rate.taxPercent+"%"}</td>
                        <td className={classes.pricetableTd}>{rate.tax}</td>
                        <td className={classes.pricetableTd}>{dayTotal}</td>
                      </tr>
                    )
                  })
                })
              } */}
              {/* <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <th>Total</th>
                <th>{total}</th>
              </tr> */}
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
                        {/* {
                          i === Object.keys(dayWiseRates).length-1 && index === dayWiseRates[date].length-1 &&
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th style={{paddingBottom:"1rem", fontSize:"18px", fontWeight:600}}>Total</th>
                              <th style={{paddingBottom:"1rem", fontSize:"18px", fontWeight:600}}>{data.totalRoomCharges}</th>
                            </tr>
                        } */}
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
          {FormUtils.renderButton({
            type: "submit",
            size: "large",
            label: "Continue",
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

export default PreBillingForm;
