import Joi from "joi-browser";

const roomsSchema = Joi.object().keys({
  roomType: Joi.string()
    .required()
    .label("Room Type"),
  roomNumber: Joi.required().label("Room Number")
});

export default {
  bookingFormSchema: {
    firstName: Joi.string()
      .required()
      .label("First Name"),
    lastName: Joi.string()
      .required()
      .label("Last Name"),
    address: Joi.string()
      .required()
      .label("Address"),
    checkIn: Joi.date()
      .required()
      .label("Check In"),
    checkOut: Joi.date()
      .required()
      .label("Check Out"),
    adults: Joi.number()
      .max(999)
      .required()
      .label("Adults"),
    children: Joi.number()
      .max(99)
      .required()
      .label("Children"),
    contactNumber: Joi.string()
      .length(10)
      .required()
      .label("Contact Number"),
    roomCharges: Joi.number()
      .required()
      .label("Room Charges"),
    advance: Joi.number()
      .label("Advance"),
    rooms: Joi.array()
      .items(roomsSchema)
      .unique()
      .required(),
      Idproof: Joi.string()
      .label("ID_Proof"),
  },
  billingFormSchema: {
    cash: Joi.number(),
    card: Joi.number(),
    wallet: Joi.number()
  },
  POSFormSchema: {
    roomNumber: Joi.string()
      .required()
      .label("Room Number"),
    _id: Joi.string()
      .required()
      .label("Booking"),
    date: Joi.date()
      .required()
      .label("Date"),
    amount: Joi.number()
      .required()
      .label("Amount"),
    remarks: Joi.string()
      .required()
      .label("Remarks")
  }
};
