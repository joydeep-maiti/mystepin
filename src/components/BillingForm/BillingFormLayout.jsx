import React, { useEffect, useState, useContext } from "react";
import { withRouter} from 'react-router-dom'
import SnackBarContext from "../../context/snackBarContext";

import BillingForm from "./BillingForm";
import PreBillingForm from "./PreBillingForm";
import BillingHeader from "./BillingFormHeader";
import Card from "../../common/Card/Card";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";

import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import bookingService from "../../services/bookingService";
import taxService from "../../services/taxService";
import billingService from "../../services/billingService";
import advanceService from '../../services/advanceService'
const { success, error } = constants.snackbarVariants;

const schema = schemas.billingFormSchema;

const BillingFormLayout = props => {
  const handleSnackbarEvent = useContext(SnackBarContext);
  
  const {booking} = props;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [selectedBooking, setSelectedBooking] = useState({});
  const [taxSlabs, setTaxSlabs] = useState();
  const [roomCharges, setRoomCharges] = useState();
  const [isBillingForm, setIsBillingForm] = useState(false);
  const [due, setDue] = useState(true);
  const [advanceAmount,setAdvanceAmount] = useState(0);
  const [data, setData] = useState({
    cash: "",
    card: "",
    wallet: "",
    advance:"",
    billingStatus:"Due",
    taxStatus: "withTax",
    totalRoomCharges:0,
    cardNum:"",
    walletType:"",
    tax:0

  });
  const [payment, setPayment] = useState({
    cash: { checked: false, disable: true },
    card: { checked: false, disable: true },
    wallet: { checked: false, disable: true }
  });
  React.useEffect(()=>{
    fetchAdvance();
},[])
const fetchAdvance = async()=>{
  const { selectedBooking: booking} = props;
  if(booking!==null)
  {
    const advance = await advanceService.getAdvanceByBookingId(booking._id);
    let total = 0;
    if(advance){
      advance.advance.map( ad => total += parseInt(ad.advanceP));

      setAdvanceAmount(total);
    }
    console.log("Booking inside",advanceAmount)
  }
}
 useEffect(() => {
    const { selectedBooking: booking, history } = props;
    if (booking === null) history.replace("/");
    else getTaxSlabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTaxSlabs = async () => {
    const { selectedBooking: booking, history } = props;
    const taxSlabs = await taxService.getTaxSlabs("GST");
    const roomCharges = booking.roomCharges;
    setSelectedBooking(booking);
    setTaxSlabs(taxSlabs);
    setRoomCharges(roomCharges);
  };

  useEffect(() => {
    if(Number(data.card)+Number(data.cash)+Number(data.wallet) === data.balance){
      setDue(false)
      setData({
        ...data,
        billingStatus:"Paid",
      })
    }else {
      setDue(true)
      setData({
        ...data,
        billingStatus:"Due",
      })
    }
  }, [data.cash,data.card,data.wallet,data.balance]);

  const handleInputChange = ({ currentTarget: input }) => {
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      schema
    );

    // updatedState.errors = checkBalance(updatedState.data, updatedState.errors);

    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleCheckboxChange = (event, name) => {
    // debugger
    const checked = event.currentTarget.checked;
    let clonedData = { ...data };
    let clonedPayment = { ...payment };
    let clonedErrors = { ...errors };

    switch (name) {
      case "cash":
        clonedPayment.cash = { disable: !checked, checked };
        clonedErrors.cash && !checked && delete clonedErrors.cash;
        if (!checked) clonedData.cash = "";
        if (checked) clonedData.cash = Number(data.balance)-(Number(clonedData.card) + Number(clonedData.wallet))
        break;

      case "card":
        clonedPayment.card = { disable: !checked, checked };
        clonedErrors.card && !checked && delete clonedErrors.card;
        if (!checked) clonedData.card = "";
        if (checked) clonedData.card = Number(data.balance)-(Number(clonedData.cash) + Number(clonedData.wallet))
        break;

      case "wallet":
        clonedPayment.wallet = { disable: !checked, checked };
        clonedErrors.wallet && !checked && delete clonedErrors.wallet;
        if (!checked) clonedData.wallet = "";
        if (checked) clonedData.wallet = Number(data.balance)-(Number(clonedData.card) + Number(clonedData.cash))
        break;

      default:
        clonedPayment = { ...clonedPayment };
        break;
    }
    checked && delete clonedErrors.customError;

    // clonedErrors = checkBalance(clonedData, clonedErrors);

    setPayment(clonedPayment);
    setErrors(clonedErrors);
    setData(clonedData);
  };

  const handleRadioGroupChange = event => {
    const value = event.currentTarget.value;
    if (value === "withTax") implementTaxes();
    else if (value === "withoutTax") removeTaxes();
  };

  const checkBalance = (data, errors) => {
    // debugger
    const total =
      ((data.cash && parseInt(data.cash)) || 0) +
      ((data.card && parseInt(data.card)) || 0) +
      ((data.wallet && parseInt(data.wallet)) || 0);

    if (total !== parseInt(data.balance))
      return false
    return true
   
    // if (total !== parseInt(selectedBooking.balance))
    //   errors.customError = "Total varies from balance";
    // else delete errors.customError;

    // return errors;
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const clonedData = { ...data };

    let errors = FormUtils.validate(clonedData, schema);
    if (clonedData.cash || clonedData.card || clonedData.wallet || clonedData.billingStatus)
      delete errors.customError;
    else errors.customError = "Please select any payment mode";

    if(!checkBalance(clonedData, errors)){
      if(!window.confirm("Total varies from balance. Do you want to proceed?")){
        return
      }
    }else {
      if(!window.confirm("Do you want to proceed with billing?")){
        return
      }
    }

    const clonedPayment = payment;
    if (errors.cash) {
      !clonedPayment.cash.checked && delete errors.cash;
    }
    if (errors.card) {
      !clonedPayment.card.checked && delete errors.card;
    }
    if (errors.wallet) {
      !clonedPayment.wallet.checked && delete errors.wallet;
    }
    setErrors(errors);
    if (Object.keys(errors).length) return;

    setLoading(true);
    selectedBooking.checkedOutTime = utils.getTime();
    selectedBooking.status = { ...selectedBooking.status, checkedOut: true };
    selectedBooking.totalAmount = selectedBooking.roomCharges;
    selectedBooking.roomCharges = roomCharges;
    // console.log("selectedBooking",selectedBooking,clonedData)
    const {posData, ...paymentData} = clonedData
    const billingData = {
      bookingId: selectedBooking._id,
      hotelName: selectedBooking.hotelName,
      hotelAddress: selectedBooking.hotelAddress,
      guestName: selectedBooking.firstName+" "+selectedBooking.lastName,
      checkIn: selectedBooking.checkIn,
      checkOut: selectedBooking.checkOut,
      checkedInTime: selectedBooking.checkedInTime,
      checkedOutTime: selectedBooking.checkedOutTime,
      roomCharges: selectedBooking.roomCharges,
      advance: advanceAmount,
      roomWiseRatesForBooking: selectedBooking.roomWiseRatesForBooking,
      totalAmount: selectedBooking.totalAmount,
      posData,
      paymentData
    }
    updateBookingPayment(selectedBooking,billingData);
  };

  const updateBookingPayment = async (bookingData, billingData) => {
    console.log("bookingData, billingData",bookingData, billingData)
    const { status } = await bookingService.updateBooking(bookingData);
    if (status === 200) {
      const { status } = await  billingService.addBilling(billingData);
      if (status === 201) {
        openSnackBar("Checked out Successfully", success);
        props.onRedirectFromBilling(bookingData);
        // props.history.push("/report")
      }
    } else openSnackBar("Error Occurred", error);
    setLoading(false);
  };

  useEffect(()=>{
    if (data.taxStatus === "withTax") implementTaxes();
    else if (data.taxStatus === "withoutTax") removeTaxes();
  },[selectedBooking])

  const implementTaxes = () => {
    let total = 0
    let tax = 0
    selectedBooking && selectedBooking.roomWiseRatesForBooking && selectedBooking.roomWiseRatesForBooking.map(el=>{            
      el.rates.map(rate=>{
        const taxAmount = Number(rate.tax).toFixed(2);
        const dayTotal = Number(rate.rate)+Number(taxAmount);
        tax+=Number(taxAmount)
        total+=dayTotal;
      })
    })
    setData({
      ...data,
      totalRoomCharges: Number(selectedBooking.roomCharges)+Number(tax),
      totalCalculatedRoomCharges: total,
      tax,
      taxStatus: "withTax",
    })
    console.log("totalRoomCharges",total)
  };

  const removeTaxes = () => {
    let total = 0
    selectedBooking && selectedBooking.roomWiseRatesForBooking && selectedBooking.roomWiseRatesForBooking.map(el=>{            
      el.rates.map(rate=>{
        const dayTotal = Number(rate.rate);
        total+=dayTotal;
      })
    })
    setData({
      ...data,
      totalRoomCharges: Number(selectedBooking.roomCharges),
      totalCalculatedRoomCharges: total,
      tax: 0,
      taxStatus: "withoutTax",

    })
  };

  // const implementTaxes = () => {
  //   const obj = getUpdatedRoomCharges(roomCharges);
  //   calculateRoomCharges(obj.roomCharges, obj.taxPercent, "withTax");
  // };

  const calculateRoomCharges = (roomCharges, taxPercent, taxType) => {
    const clonedSelectedBooking = { ...selectedBooking };
    const balance = roomCharges - parseInt(clonedSelectedBooking.advance);

    clonedSelectedBooking.roomCharges = roomCharges.toString();
    clonedSelectedBooking.balance = balance.toString();

    const clonedData = { ...data };
    clonedData.taxPercent = taxPercent;
    clonedData.taxStatus = taxType;

    // setSelectedBooking(clonedSelectedBooking);
    setData(clonedData);
  };

  const getUpdatedRoomCharges = roomCharges => {
    roomCharges = parseInt(roomCharges);
    const clonedtaxSlabs = taxSlabs;
    let taxPercent = 1;

    for (let slab of clonedtaxSlabs) {
      if (slab.lessThanAndEqual) {
        const { greaterThan, lessThanAndEqual } = slab;
        if (roomCharges > greaterThan && roomCharges <= lessThanAndEqual) {
          taxPercent = slab.taxPercent;
          break;
        }
      } else {
        taxPercent = slab.taxPercent;
        break;
      }
    }

    return {
      roomCharges: roomCharges + (roomCharges * taxPercent) / 100,
      taxPercent
    };
  };

  // const removeTaxes = () => {
  //   calculateRoomCharges(roomCharges, null, "withoutTax");
  // };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    handleSnackbarEvent(snakbarObj);
  };

  const handleChangeData = (temp) => {
    setData({
      ...data,
      ...temp
    })
  };

  const handleContinue = () => {
    setIsBillingForm(true)
  };

  const handleOnClose = () => {
    // setIsBillingForm(true)
    console.log("PROPS", props)
    props.history.goBack()
  };

  const cardContent = ()=> {
    if(isBillingForm){
      return (
        <BillingForm
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onRadioGroupChange={handleRadioGroupChange}
          onFormSubmit={handleFormSubmit}
          data={data}
          errors={errors}
          booking={selectedBooking}
          payment={payment}
          onChangeData={handleChangeData}
          due={due}
        />
      );
    }else {
      return(
        <PreBillingForm
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onRadioGroupChange={handleRadioGroupChange}
          onFormSubmit={handleContinue}
          data={data}
          errors={errors}
          booking={selectedBooking}
          payment={payment}
          onChangeData={handleChangeData}
          handleOnClose={handleOnClose}
        />
      );
    }
  }

  return (
    <React.Fragment>
      {loading && <LoaderDialog open={loading} />}
      <Card
        header={<BillingHeader title={isBillingForm?"Billing Form":"Room Rates"}/>}
        content={cardContent()}
        maxWidth={700}
        margin="30px auto"
      />
    </React.Fragment>
  );
};

export default withRouter(BillingFormLayout);
