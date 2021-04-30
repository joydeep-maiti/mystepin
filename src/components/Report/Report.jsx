import React from "react";
import Card from "../../common/Card/Card";
import ReportBody from "./ReportBody";
import ReportHeader from "./ReportHeader";

import "./Report.scss";

const Report = ({ selectedBooking: booking, history, ...props }) => {
  
  const [bill, setBill] = React.useState(null)

  React.useEffect(()=>{
    if(props.location.state){
      console.log(props.location.state)
      setBill(props.location.state)
    }
  },[])

  return (
    
      <Card
        header={<ReportHeader />}
        content={<ReportBody booking={booking} billData={props.location.state}/>}
        maxWidth={700}
        margin="40px auto"
      />
  );
};

export default Report;
