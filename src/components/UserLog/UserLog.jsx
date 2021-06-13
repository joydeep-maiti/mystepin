import React, { useState, useEffect } from 'react'
import { makeStyles, Button, InputLabel } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import './UserLog.css'
import moment from "moment";
import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import userService from '../../services/userService'
import reportService from '../../services/reportService'
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

const UserLog = () => {
  const classes = useStyles();
  const [startingDate, setStartingDate] = useState(utils.getDate(moment().startOf('month')));
  const [currentDate, setCurrentDate] = useState(utils.getDate());
  const [shouldDisable, setShouldDisable] = useState(false);
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)

  const [generatedTime, setGeneratedTime] = useState(
    moment().format('D-MMMM-YYYY h:mm A')
  )
  var sdate = moment(startingDate);
  const [startDateString, setStartDateString] = useState(sdate.format('DD') + "-" + sdate.format('MMMM') + "-" + sdate.format('YYYY'));
  var cdate = moment(currentDate);
  const [currentDateString, setCurrentDateString] = useState(cdate.format('DD') + "-" + cdate.format('MMMM') + "-" + cdate.format('YYYY'));


  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const users = await userService.getUsers()
    console.log("users", users)
    setUsers(users)
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

  //Report Function
  const generateReport = () => {
    fetchUserReport()
  }

  const fetchUserReport = async () => {
    if (!user) {
      alert("Select the Username")
      return
    }
    let total = 0;
    let start = moment(startingDate).format('yyyy-MM-DD')
    let end = moment(currentDate).format('yyyy-MM-DD')
    if (start>end) {
      alert("Please Select Valid Date Range")
      return
    }
    console.log("Start", start)
    console.log("End", end)
    let response = await reportService.getUserLogReport(user, start, end)
    console.log("response", response)

    if (response && response.length) {
      let data = []
      let counter = 1;
      for (let index = 0; index < response.length; index++) {
        if (response[index].login) {
          if (index < response.length - 1 && response[index + 1].logout) {
            data.push([
              counter,
              response[index].username,
              moment(response[index].login).local(true).format('D.MMM.YYYY, h:mm:ss A'),
              moment(response[index + 1].logout).local(true).format('D.MMM.YYYY, h:mm:ss A'),
            ])
            counter++
          } else {
            data.push([
              counter,
              response[index].username,
              moment(response[index].login).local(true).format('D.MMM.YYYY, h:mm:ss A'),
            ])
            counter++
          }
        }
      }
      console.log("data", data)
      exportReportToPDF(data)
    }
    else {
      alert("No Data Found")
    }
  }
  //Set Room Number

  const handleChange = (event) => {
    setUser(event.target.value);
  };


  //Room Options

  const getUserOptions = () => {
    return users.map(user => {
      return { label: user.username, value: user.username };
    });

  };


  const exportReportToPDF = (reportData) => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const fdate = moment(startingDate).format('D.MMM.YYYY')
    const tdate = moment(currentDate).format('D.MMM.YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = "USER LOGIN REPORT";
    let headers = [["SL NO", "USERNAME", "LOGIN TIME", "LOGOUT TIME"]];
    let content = {
      startY: 120,
      head: headers,
      body: reportData,
      theme: 'striped',
      styles: {
        cellWidth: 'wrap',
        halign: "center",
      },
      headerStyles: {
        fillColor: "#0088bc",
      },
      margin: marginLeft,
      pageBreak: 'auto'
    };
    doc.text(title, 300, 80);
    doc.setFontSize(10);
    doc.text("Report Generated at " + generatedTime, 600, 20);
    doc.setFontSize(12);
    doc.text("FROM DATE : " + fdate, 30, 60)
    doc.text("TO DATE : " + tdate, 30, 80)
    doc.setFontSize(12);
    doc.autoTable(content);
    doc.save("UserLog.pdf")
  }

  return (
    <div>
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
          User Logs
        </Typography>
      </div>
      <div className="container">


        {FormUtils.renderSelect({
          id: "Username",
          label: "Username",
          value: user,
          onChange: handleChange,
          options: getUserOptions(),
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

export default UserLog
