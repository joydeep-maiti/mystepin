import React, { useEffect, useState, useContext } from "react";
import SnackBarContext from "../../context/snackBarContext";

import BillingForm from "./BillingForm";
import BillingHeader from "./BillingFormHeader";
import Card from "../../common/Card/Card";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";

import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import bookingService from "../../services/bookingService";
import taxService from "../../services/taxService";

const { success, error } = constants.snackbarVariants;

const schema = schemas.billingFormSchema;

const BillingFormLayout = props => {
  const handleSnackbarEvent = useContext(SnackBarContext);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [selectedBooking, setSelectedBooking] = useState({});
  const [taxSlabs, setTaxSlabs] = useState();
  const [roomCharges, setRoomCharges] = useState();

  const [data, setData] = useState({
    cash: "",
    card: "",
    wallet: "",
    taxStatus: "withoutTax"
  });
  const [payment, setPayment] = useState({
    cash: { checked: false, disable: true },
    card: { checked: false, disable: true },
    wallet: { checked: false, disable: true }
  });

  useEffect(() => {
    const { selectedBooking: booking, history } = props;
    const getTaxSlabs = async () => {
      const taxSlabs = await taxService.getTaxSlabs();
      const roomCharges = booking.roomCharges;
      setSelectedBooking(booking);
      setTaxSlabs(taxSlabs);
      setRoomCharges(roomCharges);
    };
    if (booking === null) history.replace("/");
    else getTaxSlabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = ({ currentTarget: input }) => {
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      schema
    );

    updatedState.errors = checkBalance(updatedState.data, updatedState.errors);

    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleCheckboxChange = (event, name) => {
    const checked = event.currentTarget.checked;
    let clonedData = { ...data };
    let clonedPayment = { ...payment };
    let clonedErrors = { ...errors };

    switch (name) {
      case "cash":
        clonedPayment.cash = { disable: !checked, checked };
        clonedErrors.cash && !checked && delete clonedErrors.cash;
        if (!checked) clonedData.cash = "";
        if (checked) clonedData.cash = selectedBooking.balance-(clonedData.card + clonedData.wallet)
        break;

      case "card":
        clonedPayment.card = { disable: !checked, checked };
        clonedErrors.card && !checked && delete clonedErrors.card;
        if (!checked) clonedData.card = "";
        if (checked) clonedData.card = selectedBooking.balance-(clonedData.cash + clonedData.wallet)
        break;

      case "wallet":
        clonedPayment.wallet = { disable: !checked, checked };
        clonedErrors.wallet && !checked && delete clonedErrors.wallet;
        if (!checked) clonedData.wallet = "";
        if (checked) clonedData.wallet = selectedBooking.balance-(clonedData.card + clonedData.cash)
        break;

      default:
        clonedPayment = { ...clonedPayment };
        break;
    }
    checked && delete clonedErrors.customError;

    clonedErrors = checkBalance(clonedData, clonedErrors);

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
    const total =
      ((data.cash && parseInt(data.cash)) || 0) +
      ((data.card && parseInt(data.card)) || 0) +
      ((data.wallet && parseInt(data.wallet)) || 0);

    if (total !== parseInt(selectedBooking.balance))
      errors.customError = "Total varies from balance";
    else delete errors.customError;

    return errors;
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const clonedData = { ...data };

    let errors = FormUtils.validate(clonedData, schema);
    if (clonedData.cash || clonedData.card || clonedData.wallet)
      delete errors.customError;
    else errors.customError = "Please select any payment mode";

    errors = checkBalance(clonedData, errors);

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
    const paymentData = { ...selectedBooking, payment: clonedData };
    updateBookingPayment(paymentData);
  };

  const updateBookingPayment = async bookingData => {
    const { status } = await bookingService.updateBooking(bookingData);
    setLoading(false);
    if (status === 200) {
      openSnackBar("Checked out Successfully", success);
      props.onRedirectFromBilling(bookingData);
    } else openSnackBar("Error Occurred", error);
  };

  const implementTaxes = () => {
    const obj = getUpdatedRoomCharges(roomCharges);
    calculateRoomCharges(obj.roomCharges, obj.taxPercent, "withTax");
  };

  const calculateRoomCharges = (roomCharges, taxPercent, taxType) => {
    const clonedSelectedBooking = { ...selectedBooking };
    const balance = roomCharges - parseInt(clonedSelectedBooking.advance);

    clonedSelectedBooking.roomCharges = roomCharges.toString();
    clonedSelectedBooking.balance = balance.toString();

    const clonedData = { ...data };
    clonedData.taxPercent = taxPercent;
    clonedData.taxStatus = taxType;

    setSelectedBooking(clonedSelectedBooking);
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

  const removeTaxes = () => {
    calculateRoomCharges(roomCharges, null, "withoutTax");
  };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    handleSnackbarEvent(snakbarObj);
  };

  const cardContent = (
    <BillingForm
      onInputChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
      onRadioGroupChange={handleRadioGroupChange}
      onFormSubmit={handleFormSubmit}
      data={data}
      errors={errors}
      booking={selectedBooking}
      payment={payment}
    />
  );

  return (
    <React.Fragment>
      {loading && <LoaderDialog open={loading} />}
      <Card
        header={<BillingHeader />}
        content={cardContent}
        maxWidth={700}
        margin="80px auto"
      />
    </React.Fragment>
  );
};

export default BillingFormLayout;
