import React from "react";
import moment from "moment";
import colorConverter from "hex-to-rgba";
import { getShortName } from "./../../utils/utils";
import { makeStyles, Table, Paper, ButtonBase } from "@material-ui/core";
import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";
import Popover from "../../common/Popover/Popover";
import utils from "../../utils/utils";
import "./CalendarBody.scss";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "85%",
    overflowY: "auto"
  },
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  tableBody: {
    overflow: "auto"
  },
  table: {
    minWidth: 700
  },
  tableWrapper: {
    maxHeight: 407,
    overflow: "auto"
  },
  div: {
    padding: 6,
    width: "100%",
    height: "100%",
    fontWeight: 600
  },
  buttonDisable: {
    backgroundColor: "#d7d7d7",
    color: "#9f9f9f"
  },
  buttonBase: {
    width: "100%",
    height: "100%"
  },
  tableCell: {
    padding: 0,
    textAlign: "center",
    fontSize:"50px",
    borderRight: "2px solid #9e9e9e",
    borderBottom: "2px solid #9e9e9e",
    // width: "9%",
    "&:last-child": {
      padding: 0
    },
    position:"relative"
  },
  roomPop: {
    position:"absolute",
    bottom:"26px",
    fontSize:"50px",
    fontWeight: 600
  },
  roomTypePop: {
    position:"absolute",
    bottom:"6px",
    fontSize:"50px",
    fontWeight: 600
  }
}));


const CalendarBody = ({ tableHeaders, tableRows, loading, dateObj, view , presentDate}) => {
  const [open] = React.useState(true);
  const classes = useStyles();

  // console.log("tableHeaders",tableHeaders)
  console.log("tableRows",tableRows)
  // console.log("loading",loading)
  // console.log("dateObj",dateObj)

  return (
    <React.Fragment>
      {loading && <LoaderDialog open={open} />}
      <Paper className={`${classes.root} hideSrollbar`}>
        <Table className={classes.root} stickyHeader>
          <TableHead>
            {view!=="day" && <TableRow>{renderTableHead(tableHeaders, classes)}</TableRow>}
          </TableHead>
          <TableBody className={classes.tableBody}>
            {renderTableRows(tableRows, classes, dateObj,view,presentDate)}
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
};

const renderTableHead = (tableHeaders, classes) => {
  return (
    <React.Fragment>
      {tableHeaders.map(value => (
        <TableCell className={classes.tableCell} key={`date_${value.date}`}>
          <ButtonBase className={classes.buttonBase}>
            <div className={classes.div}>{value.date}</div>
          </ButtonBase>
        </TableCell>
      ))}
    </React.Fragment>
  );
};

const renderTableRows = (tableRows, classes, dateObj, view, presentDate) => {
  console.log("tableRows",tableRows)
  return (
    <React.Fragment>
      {tableRows.map((row, index) => (
        <TableRow key={`row_${index}`} style={view==="day"?{height:"4rem"}:{height:"unset", lineHeight:"1rem"}}>
          {renderTableColumns(row, classes, dateObj, view, presentDate)}
        </TableRow>
      ))}
    </React.Fragment>
  );
};

const renderTableColumns = (row, classes, dateObj, view, presentDate) => {
  return (
    <React.Fragment>
      {row && row.map((column, index) =>
        getStandardCell(getArgObj(column, index, classes, dateObj,view, presentDate))
      )}
    </React.Fragment>
  );
};

const getStandardCell = (...argument) => {
  const arg = argument[0];

  const customStyle = {
    width: arg.view=="day"?"9%":"unset",
    pointerEvents: "",
    backgroundColor: arg.color,
    lineHeight:"1rem"
  };
  const buttonBasedStyle = {
    pointerEvents: arg.booking && "all",
    cursor: "pointer"
  };

  return (
    <TableCell
      key={arg.key}
      style={customStyle}
      className={arg.classes.tableCell}
      onClick={() => arg.handleRedirect(arg.booking, arg.room, arg.date)}
    >
      <ButtonBase
        disabled={arg.disable}
        style={buttonBasedStyle}
        className={
          arg.disable
            ? `${arg.classes.buttonBase} ${arg.classes.buttonDisable}`
            : arg.classes.buttonBase
        }
      >
        <div className={arg.classes.div}>
          <Popover
            content={arg.view=="day"?arg.booking && `${arg.booking.firstName} ${arg.booking.lastName}`:arg.value}
            popoverContent={
              arg.booking && `${arg.booking.firstName} ${arg.booking.lastName}`
            }
          />
        </div>
        {arg.view=="day" && <div className={arg.classes.roomPop}>
          <Popover
            content={arg.room.roomNumber}
            popoverContent={
              arg.room.roomNumber
            }
          />
        </div>}
        {arg.view=="day" && <div className={arg.classes.roomTypePop}>
          <Popover
            content={arg.room.roomType}
            popoverContent={
              arg.room.roomType
            }
          />
        </div>}
      </ButtonBase>
    </TableCell>
  );
};

const getArgObj = (column, index, classes, dateObj, view, presentDate) => {

  let { show, room, booking, handleRedirect, color } = column;
  //  console.log("column",column)
  const currentDate = moment().date();
  const name = booking && getShortName(booking.firstName, booking.lastName);
  const key = `column_${index}`;

  const currentDateObj = utils.getDateObj(utils.getDate());

  const { month, year } = dateObj;
  const { month: currentMonth, year: currentYear } = currentDateObj;
  let disable = false;

  if (month === currentMonth && year === currentYear) {
    disable = index < currentDate && view!=="day" && view!=="week" ? true : false;
    handleRedirect =
      index >= currentDate || booking || view==="day" || view=== "week" ? handleRedirect : () => {};
  }

  const date = view==="day" ? presentDate : new Date(`${dateObj.month + 1}/${index}/${dateObj.year}`);

  if (show) return { key, value: room.roomNumber, classes };
  else
    return {
      key,
      value: name,
      disable,
      handleRedirect,
      color,
      booking,
      classes,
      date,
      room,
      view
    };
};

export default CalendarBody;