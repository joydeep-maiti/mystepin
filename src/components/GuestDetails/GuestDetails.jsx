import React, { useState, useEffect } from 'react'
import { makeStyles, Button, InputLabel } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import './GuestDetails.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import reportOptions from '../../services/reportOptions'
import guestReport from '../../services/guestReport'
import roomService from '../../services/roomService'
import jsPDF from 'jspdf';
import "jspdf-autotable";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: "5rem"
  },
  title: {
    flexGrow: 2
  },
  buttons: {
    marginTop: 20
  }
}));
const GuestDetails = () => {
  const [startingDate, setStartingDate] = useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [bookings, setBookings] = useState([]);
  const [guestCategory, setGuestCategory] = useState("");
  const [shouldDisable, setShouldDisable] = useState(false);
  const [guestTypes, setGuestTypes] = useState([]);
  const [isRoomWise, setIsRoomWise] = useState(false)
  const [roomNumbers, setRoomNumbers] = useState([])
  const [roomNumber, setRoomNumber] = useState("")
  let headers = [];
  const [generatedTime, setGeneratedTime] = useState(
    moment().format('D-MMMM-YYYY h:mm A')
  )
  var sdate = moment(startingDate);
  const [startDateString, setStartDateString] = useState(sdate.format('DD') + "-" + sdate.format('MMMM') + "-" + sdate.format('YYYY'));
  var cdate = moment(currentDate);
  const [currentDateString, setCurrentDateString] = useState(cdate.format('DD') + "-" + cdate.format('MMMM') + "-" + cdate.format('YYYY'));
  //getting options
  useEffect(() => {
    fetchBillingTypes()
  }, [])
  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    const rooms = await roomService.getRooms();
    console.log("Rooms", rooms)
    const roomN = []
    rooms.map(room => {
      let obj = { roomNumber: room.roomNumber, roomType: room.roomType }
      roomN.push(obj)
    })
    setRoomNumbers(roomN)
  }

  useEffect(() => {
    if (guestCategory === "Room Wise") {
      setIsRoomWise(true)
    }
    else {
      setIsRoomWise(false)
    }
  }, [guestCategory])
  const fetchBillingTypes = async () => {
    let options = await reportOptions.getBillingOptions("Guest Report");
    const types = []
    options.forEach(option => {
      types.push(option)
    })
    setGuestTypes(types)
  }

  //Handle starting date Change
  const handleStartingDateChange = (date) => {
    setStartingDate(utils.getDate(date));
    var d = moment(date);
    setStartDateString(d.format('DD') + "-" + d.format('MMMM') + "-" + d.format('YYYY'));
  };
  //Handle current date Change
  const handleCurrentDateChange = (date) => {
    setCurrentDate(utils.getDate(date));
    var d = moment(date);
    setCurrentDateString(d.format('DD') + "-" + d.format('MMMM') + "-" + d.format('YYYY'));
  };
  //Get Plan Options
  const getPlanOptions = () => {
    return guestTypes.map(type => {
      return { label: type, value: type };
    });
  };
  //Handle Select Change
  const handleSelectChange = (event) => {
    setGuestCategory(event.target.value);
    console.log("event", guestCategory);
  }

  const classes = useStyles();


  //Report Function

  const generateReport = () => {
    if (guestCategory !== "Room Wise") { fetchAndGenerateGuestReport() }
    else {
      fetchRoomWiseReport()
    }

  }

  ///Fetching Data from backend
  const fetchAndGenerateGuestReport = async () => {
    let total = 0;
    let startD = moment(startingDate).format('yyyy-MM-DD')
    let currentD = moment(currentDate).format('yyyy-MM-DD')
    console.log("Start", startD)
    console.log("End", currentD)
    let options = await guestReport.getGuestDetails(startD, currentD, guestCategory)
    let len = options.length || 0;
    console.log("len", len)
    console.log("Response", options)
    console.log("Response", options.length)
    console.log("Category", guestCategory)
    if (options.length == 0) {
      alert("No Data Avalaible")
    }
    else if (options.length != 0) {
      if (guestCategory === "Domicillary Guest") {
        let data = options.map(option => {
          let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
          let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
          total += parseInt(option.Amount)
          return ([
            option.guestName,
            checkIn,
            checkOut,
            option.NoofRooms,
            option.nationality,
            option.bookedBy,
            option.referenceNumber,
            option.Advance,
            option.Amount,
          ])
        })
        exportGuestReportToPDF(data, len, total)
      }
      else if (guestCategory === "Foreign Guest") {
        let data = options.map(option => {
          let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
          let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
          total += parseInt(option.Amount)
          return ([
            option.guestName,
            checkIn,
            checkOut,
            option.NoofRooms,
            option.nationality,
            option.PassportNumber,
            option.bookedBy,
            option.referenceNumber,
            option.Advance,
            option.Amount,
          ])
        })
        exportGuestReportToPDF(data, len, total)
      }
      if (guestCategory === "Consolidated Guest") {
        let data = options.map(option => {
          let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
          let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
          total += parseInt(option.Amount)
          return ([
            option.guestName,
            checkIn,
            checkOut,
            option.NoofRooms,
            option.nationality,
            option.bookedBy,
            option.referenceNumber,
            option.Advance,
            option.Amount,
          ])
        })
        exportGuestReportToPDF(data, len, total)
      }
      if (guestCategory === "Additional Guests") {
        let data = options.map(option => {
          let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
          let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
          total += parseInt(option.Amount)
          let guests = ""
          option.Guests && option.Guests.slice(1).map(el=>{
            guests+= `${el.firstName} ${el.lastName} \n`
          })
          return ([
            option.guestName,
            guests,
            checkIn,
            checkOut,
            option.NoofRooms,
            option.nationality,
            option.bookedBy,
            option.referenceNumber,
            option.Advance,
            option.Amount,
          ])
        })
        exportGuestReportToPDF(data, len, total)
      }

    }
    else {
      alert("No Guest in specfied Category")
    }
  }
  const fetchRoomWiseReport = async () => {
    let total = 0;
    let startD = moment(startingDate).format('yyyy-MM-DD')
    let currentD = moment(currentDate).format('yyyy-MM-DD')
    console.log("Start", startD)
    console.log("End", currentD)
    let options = await guestReport.getGuestDetails(startD, currentD, guestCategory, roomNumber)
    let len = options.length || 0;
    console.log("len", len)
    console.log("Response", options)
    console.log("Response", options.length)
    console.log("Category", guestCategory)
    if (roomNumber.length == 0) {
      alert("Select the Roomnumber")
    }
    else if (options.length == 0) {
      alert("No Data Avalibale");
    }

    else if ((options.length != 0) && roomNumber) {
      let data = options.map(option => {
        let checkIn = moment(option.checkIn).format('D-MMMM-YYYY');
        let checkOut = moment(option.checkOut).format('D-MMMM-YYYY');
        total += parseInt(option.Amount)
        return ([
          option.guestName,
          checkIn,
          checkOut,
          option.roomNumber,
          option.nationality,
          option.bookedBy,
          option.Amount,
        ])
      })
      exportGuestReportToPDF(data, len, total)
    }
    else {
      alert("Something worng please try again")
    }

  }
  //Set Room Number

  const handleRoomChange = async (event) => {
    event.preventDefault();
    setRoomNumber(event.target.value);
    console.log("Room Number", roomNumber)
  };


  //Room Options

  const getRoomOptions = () => {
    return roomNumbers.map(type => {
      return { label: type.roomNumber + " - " + type.roomType, value: type.roomNumber };
    });

  };


  const exportGuestReportToPDF = (reportData, len, total) => {

    const roomtype = roomNumbers.filter((room) => { if (room.roomNumber === roomNumber) { return `${room.roomNumber} - ${room.roomType}` } })
    //const room = `${roomtype[0].roomNumber} - ${roomtype[0].roomType}`
    var room = null;
    if (guestCategory === "Room Wise") {
      const roomtype = roomNumbers.filter((room) => { if (room.roomNumber === roomNumber) { return `${room.roomNumber} - ${room.roomType}` } })
      room = `${roomtype[0].roomNumber} - ${roomtype[0].roomType}`
    }
    const unit = "pt";
    const size = "A3"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const date = moment().format('D.MMM.YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = guestCategory === "Guest" ? "Domicillary Guest Report " : `${guestCategory} REPORT`;
    let headers = [["NAME OF THE GUEST", "CHECKIN", "CHECKOUT", "NO OF ROOMS", "NATIONALITY", "BOOKED BY", "REFERENCE NUMBER", "BILLING ADVANCE", "BILLING AMOUNT"]];
    if (guestCategory === "Foreign Guest") {
      headers = [["NAME OF THE GUEST", "CHECKIN", "CHECKOUT", "NO OF ROOMS", "NATIONALITY", "PASSPORT NUMBER", "BOOKED BY", "REFERENCE NUMBER", "BILLING ADVANCE", "BILLING AMOUNT"]];
    }
    if (guestCategory === "Room Wise") {
      headers = [["NAME OF THE GUEST", "CHECKIN", "CHECKOUT", "ROOM NO", "NATIONALITY", "BOOKED BY", "BILLING AMOUNT"]];

    }
    if (guestCategory === "Additional Guests") {
      headers = [["NAME OF THE GUEST", "ADDITIONAL GUESTS","CHECKIN", "CHECKOUT", "ROOM NO", "NATIONALITY", "BOOKED BY", "REFERENCE NUMBER", "BILLING ADVANCE", "BILLING AMOUNT"]];

    }
    let content = {
      startY: 120,
      head: headers,
      body: reportData,
      theme: 'striped',
      styles: {
        cellWidth: 'wrap',
        valign: 'middle',
      },
      headStyles: {
        3: { halign: 'center' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' }
      },
      columnStyles: { 6: { halign: 'center' }, 3: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' } },
      margin: marginLeft,
      pageBreak: 'auto'
    };
    if (guestCategory === "Foreign Guest") {
      content = {
        startY: 120,
        head: headers,
        body: reportData,
        theme: 'striped',
        styles: {
          cellWidth: 'wrap',
          valign: 'middle',
        },
        headStyles: {
          3: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' }
        },
        columnStyles: { 5: { halign: 'center' }, 3: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' }, 9: { halign: 'center' } },
        margin: marginLeft,
        pageBreak: 'auto'
      };
    }
    if (guestCategory === "Additional Guests") {
      content = {
        startY: 120,
        head: headers,
        body: reportData,
        theme: 'striped',
        styles: {
          cellWidth: 'wrap',
          valign: 'middle',
        },
        headerStyles: {
          fillColor: "#0088bc",
          valign: 'middle',
          halign : 'center'
        },
        columnStyles: { 5: { halign: 'center' },2: { halign: 'center' }, 3: { halign: 'center' },4: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'right' },9: { halign: 'right' }, 6: { halign: 'center' } },
        margin: marginLeft,
        pageBreak: 'auto'
      };
    }
    doc.text(title, 500, 40);
    doc.setFontSize(10);
    doc.text("Report Generated at " + generatedTime, 900, 40);
    doc.setFontSize(15);
    doc.text("From : " + startDateString, 100, 90);
    doc.text("To : " + currentDateString, 250, 90);
    doc.text("No of Guests : " + len, 400, 90)
    if (guestCategory === "Room Wise") {
      doc.text("Room Number : " + room, 550, 90)
    }
    doc.setFontSize(12);
    doc.autoTable(content);
    let finalY = doc.lastAutoTable.finalY; // The y position on the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.5);
    doc.line(18, finalY + 1, 1180, finalY + 1)
    doc.text(1000, finalY + 40, `TOTAL AMOUNT: ${total}`);
    doc.save(guestCategory === "Guest" ? "Domicillary Guest Report " : `${guestCategory} REPORT`)
  }
  return (
    <div>
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          Guest
        </Typography>
      </div>
      <div className="container">
        {FormUtils.renderSelect({
          id: "guest",
          label: "Guest",
          name: "guest",
          value: guestCategory,
          onChange: event => handleSelectChange(event),
          options: getPlanOptions(),
          disabled: shouldDisable
        })}


        {isRoomWise && FormUtils.renderSelect({
          id: "roomNumber",
          label: "Room Number",
          value: roomNumber,
          onChange: event => handleRoomChange(event),
          options: getRoomOptions(),
          disabled: shouldDisable
        })
        }

        <div className="formdates">

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              format="dd/MMMM/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="From"
              value={startingDate}
              onChange={handleStartingDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ width: '150px' }}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}
            style={{ marginLeft: "rem" }}>
            <KeyboardDatePicker
              disableToolbar
              format="dd/MMMM/yyyy"
              margin="normal"
              id="date-picker-dialog"
              label="To"
              maxDate={currentDate}
              value={currentDate}
              onChange={handleCurrentDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              style={{ marginLeft: "3.5rem", width: '150px' }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className="buttoncontainer">
          <Button type="submit" className="button" onClick={generateReport}>
            Generate
          </Button>
        </div>
      </div>

    </div>



  )
}

export default GuestDetails
