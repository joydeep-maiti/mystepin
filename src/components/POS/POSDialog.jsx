import React from "react";

import POSForm from "./POSForm";

import { DialogTitle} from "@material-ui/core";

const POSDialog = ({ allBookings, onClose, title, onSnackbarEvent }) => {

  // console.log("POSDialog",allBookings,title)

  return (
    <React.Fragment>
      <DialogTitle>POS-{title}</DialogTitle>
       
      <POSForm
        allBookings={allBookings}
        onClose={onClose}
        title={title}
        // onSnackbarEvent={onSnackbarEvent}
      />
    </React.Fragment>
  );
};

export default POSDialog;
