import React from "react";

import AdvancedForm from "./AdvancedForm";

import { DialogTitle } from "@material-ui/core";

const AdvancedDialog = ({ allBookings, onClose, title, onSnackbarEvent }) => {

  return (
    <React.Fragment>
      <DialogTitle>{title}</DialogTitle>
      <AdvancedForm
        allBookings={allBookings}
        onClose={onClose}
        title={title}
        // onSnackbarEvent={onSnackbarEvent}
      />
    </React.Fragment>
  );
};

export default AdvancedDialog;
