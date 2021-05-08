import React from "react";
import ReactToPrint from "react-to-print";
import ReactToPdf from "react-to-pdf";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import billingService from "../../services/billingService";

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    marginTop: 20,
    textAlign: "right",
  },
  btnSecondary: {
    marginRight: 20,
  },
}));

const pdfComponentRef = React.createRef();

const ReportGenerator = ({ booking }) => {
  console.log("booking", booking);
  const getFullName = () => `${booking.firstName} ${booking.lastName}`;
  let balance =
    (Number(booking.paymentData.balance) - (Number(booking.paymentData.cash)+Number(booking.paymentData.card)+Number(booking.paymentData.wallet))).toFixed(2);

  const [posItems, setPosItems] = React.useState([]);
  const [posSum, setPosSum] = React.useState({});

  React.useEffect(() => {
    if (booking.posData) {
      balance += parseInt(booking.paymentData.posTotal);
      let posItem = booking.posData.pos;
      let posVar = {};
      let res = Object.keys(posItem);
      res.forEach((i) => {
        let sum = 0;
        posItem[i].map((item) => {
          sum += parseInt(item.amount);
        });
        console.log(sum);
        posVar[i] = sum;
      });
      // console.log("res",res);
      // console.log("sum values",posVar);
      setPosItems(res);
      setPosSum(posVar);
    }
  }, [booking]);
  const keys = Object.keys(posSum).map((key) => {
    return key;
  });

  const getCheckinDateandTime = () =>
    `${utils.getFormattedDate(booking.checkIn)} ${booking.checkedInTime}`;
  const getCheckoutDateandTime = () =>
    `${utils.getFormattedDate(booking.checkOut)} ${booking.checkedOutTime}`;

  return (
    <div className="report" ref={pdfComponentRef}>
      <div className="report__container">
        <div className="report__header-primary">
          <Typography variant="h4">RECEIPT</Typography>
          <div>
            <Typography variant="h4">{booking.hotelName}</Typography>
            <Typography variant="h6">{booking.hotelAddress}</Typography>
          </div>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Bill Number</span>
            <span className="report-value">{booking.billingId}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Billing Date</span>
            <span className="report-value">
              {utils.getFormattedDate(booking.checkOut)}
            </span>
          </div>
        </div>
        <div className="report__header-secondary">
          <Typography variant="subtitle1">GUEST DETAILS</Typography>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Name</span>
            <span className="report-value">{getFullName()}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Address</span>
            <span className="report-value">{booking.address}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Contact Number</span>
            <span className="report-value">{booking.contactNumber}</span>
          </div>
        </div>
        <div className="report__header-secondary">
          <Typography variant="subtitle1">BOOKING DETAILS</Typography>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Check In Date and Time</span>
            <span className="report-value">{getCheckinDateandTime()}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Check Out Date and Time</span>
            <span className="report-value">{getCheckoutDateandTime()}</span>
          </div>
          <div className="report-row">
            <span className="report-key">No of Rooms</span>
            <span className="report-value">{booking.rooms.length}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Adult</span>
            <span className="report-value">{booking.adults}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Child</span>
            <span className="report-value">{booking.children}</span>
          </div>
          <div className="report-row">
            <span className="report-key">No of Nights</span>
            <span className="report-value">
              {utils.getDiffBetweenDays(booking.checkIn, booking.checkOut)}
            </span>
          </div>
        </div>
        <div className="report__header-secondary">
          <Typography variant="subtitle1">CHARGE DETAILS</Typography>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Room Charges</span>
            <span className="report-value">&#8377; {booking.roomCharges}</span>
          </div>
          {booking.paymentData.taxStatus === "withTax" && (
            <React.Fragment>
              <div className="report-row">
                <span className="report-key">Tax Amount</span>
                <span className="report-value">
                  &#8377; {booking.paymentData.tax}
                </span>
              </div>
              <div className="report-row">
                <span className="report-key">Room Total</span>
                <span className="report-value">
                  &#8377; {booking.paymentData.totalRoomCharges}
                </span>
              </div>
            </React.Fragment>
          )}
          {booking.paymentData.posTotal && (
            <React.Fragment>
              {Object.keys(posSum).map((key) => {
                return (
                  <div className="report-row">
                    <span className="report-key">{key}</span>
                    <span className="report-value">&#8377;{posSum[key]}</span>
                  </div>
                );
              })}
              <div className="report-row">
                <span className="report-key">POS Total</span>
                <span className="report-value">
                  &#8377; {booking.paymentData.posTotal}
                </span>
              </div>
            </React.Fragment>
          )}
          <div className="report-row">
            <span className="report-key">Advance</span>
            <span className="report-value">&#8377; {booking.advance}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Balance</span>
            <span className="report-value">&#8377; {booking.paymentData.balance}</span>
          </div>
        </div>
        <div className="report__header-secondary">
          <Typography variant="subtitle1">PAYMENT DETAILS</Typography>
        </div>
        <div className="report__section">
          {booking.paymentData.cash && (
            <div className="report-row">
              <span className="report-key">Payment By Cash</span>
              <span className="report-value">
                &#8377; {booking.paymentData.cash}
              </span>
            </div>
          )}
          {booking.paymentData.card && (
            <div className="report-row">
              <span className="report-key">Payment By Card(xxxx-xxxx-xxxx-{booking.paymentData.cardNum})</span>
              <span className="report-value">
                &#8377; {booking.paymentData.card}
              </span>
            </div>
          )}
          {booking.paymentData.wallet && (
            <div className="report-row">
              <span className="report-key">Payment By Wallet({booking.paymentData.walletType})</span>
              <span className="report-value">
                &#8377; {booking.paymentData.wallet}
              </span>
            </div>
          )}
          <div>
          <div className="report-row">
              <span className="report-key">Billing Status</span>
              <span className="report-value">
                <b>{booking.paymentData.billingStatus}</b>
              </span>
            </div>
            { booking.billingStatus==="paid" &&
            <div className="report-row">
              <span className="report-key">Due Amount</span>
              <span className="report-value">
                &#8377; {balance}
              </span>
            </div>
            }
            </div>

        </div>
      </div>
    </div>
  );
};

const ReportBody = ({ booking, billData }) => {

  console.log("billData",billData)

  const classes = useStyles();
  const [bill, setBill] = React.useState(null);
  
  React.useEffect(() => {
    booking && !billData && fetchBill(booking._id);
  }, [booking]);
  
  React.useEffect(() => {
    if(billData){
      const {bookingDetails, ...data} = billData
      setBill({
        ...bookingDetails,
        ...data
      })
    }
  }, [billData]);

  const fetchBill = async (id) => {
    const response = await billingService.getBillByBookingId(id);
    setBill(response);
  };

  booking && delete booking.roomCharges

  return (
    <div>
      {bill && <ReportGenerator booking={Object.assign({}, bill, booking)} />}
      <div className={classes.btnGroup}>
        <ReactToPrint
          trigger={() =>
            FormUtils.renderButton({
              type: "button",
              size: "large",
              label: "Print",
              color: "secondary",
              className: classes.btnSecondary,
              onClick: () => {},
            })
          }
          content={() => pdfComponentRef.current}
        />
        <ReactToPdf targetRef={pdfComponentRef} filename="report.pdf">
          {({ toPdf }) =>
            FormUtils.renderButton({
              type: "submit",
              size: "large",
              label: "Download",
              color: "primary",
              className: null,
              onClick: toPdf,
            })
          }
        </ReactToPdf>
      </div>
    </div>
  );
};

export default ReportBody;
