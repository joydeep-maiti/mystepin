import React from "react";
import { Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import useStyles from "./BookingFormStyle";
import "./BookingForm.scss";

const BookingForm = props => {
  const classes = useStyles();

  let [expanded] = React.useState("panel1");
  const {
    onFormSubmit,
    onInputChange: inputfun,
    onDatePickerChange: datefun,
    onSelectChange: selectfun,
    onSelectChange1: selectfun1,
    onAddRoom,
    onDeleteRoom,
    availableRooms,
    data,
    errors,
    options,
    options1,
    onBack,
    shouldDisable,
    openDatePicker,
    handleDatePicker
  } = props;

  // const roomOptions = availableRooms.map(room => {
  //   return { label: room.roomNumber, value: room.roomNumber };
  // });

  // data.rooms.map(roomId =>
  //   availableRooms.filter(room => {
  //     if (room._id === roomId) selectedRooms.push(room);
  //     return room;
  //   })
  // );

  const handleChange = panel => (event, isExpanded) => {
    // setExpanded(isExpanded ? panel : false);
  };

  const getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
      type,
      value: data[id],
      onChange: inputfun,
      error: errors[id],
      disabled: shouldDisable
    };
  };

  const getDateArgObj = (id, label, type, minDate, shouldDisable) => {
    return {
      id,
      label,
      type,
      value: data[id],
      onChange: datefun,
      error: errors[id],
      minDate,
      disabled: shouldDisable,
      open: openDatePicker[id]
    };
  };

  const getRoomOptions = roomType => {
    // if (availableRooms.length === 0) return [];

    const roomsByType = availableRooms.filter(
      room => room.roomType === roomType
    );
    return roomsByType.map(room => {
      return { label: room.roomNumber, value: room.roomNumber, room };
    });
  };

  const checkRoomError = index => {
    if (errors.rooms && errors.rooms.length > 0) {
      const err = errors.rooms.find(error => error.index === index);
      return err ? err.message : null;
    }

    return null;
  };

  return (
    <form onSubmit={event => onFormSubmit(event)}>
      <div className="form-group">
        {FormUtils.renderInput(
          getInputArgObj("firstName", "First Name", "text", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj("lastName", "Last Name", "text", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj(
            "contactNumber",
            "Contact Number",
            "number",
            shouldDisable
          )
        )}
      </div>
      <div className="form-group">
        {FormUtils.renderInput(
          getInputArgObj("address", "Address", "text", shouldDisable)
        )}
      </div>
      <div className="form-group">
        <div
          className={classes.datePicker}
          onClick={() => handleDatePicker("checkIn")}
        >
          {FormUtils.renderDatepicker(
            getDateArgObj(
              "checkIn",
              "Check In",
              "text",
              utils.getDate(),
              shouldDisable
            )
          )}
        </div>
        <div
          className={classes.datePicker}
          onClick={() => handleDatePicker("checkOut")}
        >
          {FormUtils.renderDatepicker(
            getDateArgObj(
              "checkOut",
              "Check Out",
              "text",
              data.checkIn,
              shouldDisable
            )
          )}
        </div>
        {FormUtils.renderInput(
          getInputArgObj("adults", "Adults", "number", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj("children", "Children", "number", shouldDisable)
        )}
        
      </div>
      <div className="form-group">
        {FormUtils.renderInput(
          getInputArgObj("roomCharges", "Room Charges", "number", shouldDisable)
        )}
        {FormUtils.renderInput(
          getInputArgObj("advance", "Advance", "number", shouldDisable)
        )}
      </div>
      <div className="form-group">
      
      
     
                
      {FormUtils.renderproof({
        id: "proofType",
        label: "Proof Type",
        value: options1.value,
        onChange: event => selectfun1(event),
        options1,
        
        
        disabled: shouldDisable
      })}
{FormUtils.renderInput(
getInputArgObj("Idproof", "ID Proof Number", "text", shouldDisable)
)}


</div>

      <div className={classes.panel}>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <ExpansionPanelSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            className={classes.panelHeader}
          >
            <div className={classes.expansionPanelSummary} >
              <Typography className={classes.panelLabel} >Room</Typography>
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                onClick={onAddRoom}
                disabled={shouldDisable}
              >
                <AddIcon />
              </Fab>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionPanelDetails}>
            {data.rooms.map((room, index) => {
              const error = checkRoomError(index);
              return (
                <div key={`room-${index}`} className="form-group">
                  {FormUtils.renderSelect({
                    id: "roomType",
                    label: "Room Type",
                    value: room.roomType,
                    onChange: event => selectfun(event, index),
                    options,
                    error,
                    disabled: shouldDisable
                  })}

                  {FormUtils.renderSelect({
                    id: "roomNumber",
                    label: "Room Number",
                    value: room.roomNumber,
                    onChange: event => selectfun(event, index),
                    options: getRoomOptions(room.roomType),
                    error: error ? " " : null,
                    disabled: shouldDisable
                  })}

                  <div>
                    <IconButton
                      color="secondary"
                      className={classes.deleteButton}
                      onClick={() => onDeleteRoom(index)}
                      disabled={index === 0 ? true : shouldDisable}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>

      <div className={classes.button}>
        {FormUtils.renderButton({
          type: "button",
          size: "large",
          label: "Back",
          color: "secondary",
          className: classes.buttonSec,
          disabled: false,
          onClick: onBack
        })}
        {FormUtils.renderButton({
          type: "submit",
          size: "large",
          label: "Submit",
          color: "primary",
          className: null,
          disabled: Object.keys(errors).length || shouldDisable ? true : false
        })}
      </div>
    </form>
  );
};

export default BookingForm;
