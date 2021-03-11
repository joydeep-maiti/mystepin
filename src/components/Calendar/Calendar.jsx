import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
// import Dialog from "./../../common/Dialog/Dialog";
import utils from "./../../utils/utils";
import moment from "moment";


import "./Calendar.scss";


const Calendar = props => {
  const {
    allBookings,
    allRooms,
    loading,
    currentDateObj: dateObj,
    currentDate,
    view
  } = props;

  // console.log("props",props)

  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);


  let tempRows = [];
  

  useEffect(() => {
    console.log("props",props)
    const title = getTitle(currentDate);
    setTitle(title);
    props.onLoading(true);
    props.setBookings(dateObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const title = getTitle(currentDate);
    setTitle(title);
    props.onLoading(true);
    props.setBookings(dateObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    if (allBookings.length > 0) showBookings(dateObj, allBookings, allRooms);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBookings,view]);

  useEffect(() => {
    if (allRooms.length > 0) {
      const rows = getTableRows(allRooms, dateObj);
      setRows(rows);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRooms, dateObj,view]);

  useEffect(() => {
    const title = getTitle(currentDate);
    setTitle(title);
    props.onLoading(true);
    props.setBookings(dateObj);
  }, [currentDate]);


  const showBookings = (dateObj, bookings, allRooms) => {
    tempRows = getTableRows(allRooms, dateObj);

    bookings &&
      bookings.forEach(booking => {
        let { checkIn, checkOut, months } = booking;
        const color = "#F3DB6F";
        // const color = utils.generateRandomColor();
        if (months.length > 1) {
          const updatedValue = getUpdatedValues(booking, dateObj);
          checkIn = updatedValue.checkIn;
          checkOut = updatedValue.checkOut;
        }

        booking.rooms.forEach(bookedRoom => {
          const res = allRooms.find(room => {
            return room._id === bookedRoom._id;
          });
          if(res){
            const { roomNumber } = res
            setBookingObjByRoom(roomNumber, checkIn, checkOut, booking, color);
          }
        });
      });

    setRows(tempRows);
  };

  const setBookingObjByRoom = (
    roomNumber,
    checkIn,
    checkOut,
    booking,
    color
  ) => {
    let rowIndex = null
    
    if(view === "day"){
      tempRows.forEach((rows,i)=>{
        let subindex = rows.findIndex(
          row => row.room.roomNumber === roomNumber
        )
        if(subindex !== -1){
          // console.log("subindex",subindex,i)
          rowIndex = (i*10)+subindex
        }
      })

    }else {
      rowIndex = tempRows.findIndex(
        row => row[0].room.roomNumber === roomNumber
      );
    }
    const dates = utils.daysBetweenDates(checkIn, checkOut);
    updateRowObjByDate(dates, rowIndex, booking, color);
  };

  const updateRowObjByDate = (dates, rowIndex, booking, color) => {
    const rowsArray = [...tempRows];
    // console.log("dates, rowIndex, booking",dates, rowIndex, booking)
    if(view === "day"){
      // console.log(dates,currentDate)
      dates.forEach(date => {
        if(moment(date).date() === moment(currentDate).date()){
          const dateNumber = moment(date).date();
          rowsArray[Math.floor(rowIndex/10)] = [...rowsArray[Math.floor(rowIndex/10)]];
          rowsArray[Math.floor(rowIndex/10)][rowIndex%10] = {
            ...rowsArray[Math.floor(rowIndex/10)][rowIndex%10],
            booking,
            color
          };
        }
      });
    }else{
      dates.forEach(date => {
        const dateNumber = moment(date).date();
        rowsArray[rowIndex] = [...rowsArray[rowIndex]];
        rowsArray[rowIndex][dateNumber] = {
          ...rowsArray[rowIndex][dateNumber],
          booking,
          color
        };
      });
    }
    

    tempRows = [...rowsArray];
  };

  const getTitle = date => {
    if(view === "day"){
      return `${moment(date)
        .format("dddd, Do MMMM YYYY")}`;
    }else {
      return `${moment(date)
              .format("MMMM")
              .toUpperCase()} ${moment(date).year()}`;
    }
  }

  const getTableRows = (allRooms, dateObj) => {
    let rows = []
    if(view === "day"){
      // debugger
      let len = Math.floor(allRooms.length/10);
      let rem = allRooms.length%10;
      len = len +1
      rows = new Array(len).fill();
      let roomIndex = 0
      rows.forEach((row, index) => {
        for (let i = 0; i < 10; i++) {
          if(roomIndex === allRooms.length){
            break
          }
          if(i===0){
            rows[index] = index===len-1?new Array(rem).fill():new Array(10).fill()
          }
          rows[index][i] = {
            room: { ...allRooms[roomIndex] },
            handleRedirect: handleRedirect,
            show: false
          }
          roomIndex++
        }
      });
    }else {
      rows = new Array(allRooms.length).fill();
      rows.forEach((row, index) => {
        rows[index] = new Array(dateObj.days + 1).fill({
          room: { ...allRooms[index] },
          handleRedirect: handleRedirect
        });
        rows[index][0] = { room: { ...allRooms[index] }, show: true };
      });
    }
    // console.log("rows",rows)

    return rows;
  };

  const getTableHeaders = () => {
    let tableHeaders = new Array(dateObj.days + 1).fill({});
    tableHeaders = tableHeaders.map((value, index) => {
      if (index !== 0) return { date: index < 10 ? `0${index}` : `${index}` };
      else return { date: "" };
    });

    return tableHeaders;
  };

  const getUpdatedValues = (booking, dateObj) => {
    let { checkIn, checkOut, months } = booking;
    const { month, year, days } = dateObj;
    const index = months.findIndex(month => month.month === dateObj.month);

    if (index === 0) {
      checkIn = utils.getDate(checkIn);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    } else if (index === months.length - 1) {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = utils.getDate(checkOut);
    } else {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    }

    return { checkIn, checkOut };
  };

  const handleRedirect = (bookingObj, roomObj, date) => {
    // console.log("bookingObj, roomObj, date",bookingObj, roomObj, date)
    props.onFormRedirect(bookingObj, roomObj, date);
  };

  const handleChange = value => {
    console.log("value",value)
    let prevDate = new Date(dateObj.year, dateObj.month);
    let newDate = moment(prevDate).add(value, "M");
    let newDateObj = utils.getDateObj(newDate);
    if(view === "day"){
      prevDate = currentDate
      newDate = moment(prevDate).add(value, "d");
      newDateObj = utils.getDateObj(newDate);
    }

    props.setDateObj(newDateObj, newDate);
    props.onLoading(true);
    props.setBookings(newDateObj);
  };

  return (
  
  <div className="calendar__container" style={{backgroundColor:'#F3DB6F'}}>
      <CalendarHeader
        title={title}
        onChange={handleChange}
        month={dateObj.month}
        currentDate={currentDate}
        view={view}
      />
      <CalendarBody
        tableHeaders={getTableHeaders()}
        tableRows={rows}
        loading={loading}
        dateObj={dateObj}
        view={view}
        presentDate={currentDate}
      />
      {/* {showModal && (
        <Dialog
          openModal={this.state.showModal}
          onCloseModal={this.handleCloseModal}
          size="lg"
        />
      )} */}
    </div>
  );
};

export default Calendar;
