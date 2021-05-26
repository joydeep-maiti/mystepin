import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, Button } from "@material-ui/core";
import UpdateIcon from '@material-ui/icons/Update';
import reportService from '../../services/reportService'
import jsPDF from 'jspdf';
import "jspdf-autotable";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  btnPOS: {
    marginRight: 20
  }
}));
const AdvancedMenu = ({ showAdvancedDialog }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenAdvanceMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAdvanceMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenAdvanceTabMenu = (title,size) => {
    showAdvancedDialog(title,size);
    setAnchorEl(null);
  };

  //Occupancy Chart
  const [generatedTime,setGeneratedTime] = useState(
    moment().format('D.MMMM.YYYY h:mm A')
  )
  //************************Daily Occupancy Report****************************
  const fetchAndGenerateDailyOccupanyReport = async()=>{
    let options = await reportService.getDailyOccupancyReport();
    let adults = 0
    let children = 0
    let plans = [{},{}] 
    let occupied = 0
    let continuing =0
    if(options){
      let data = options.map(el=>{
        adults+=Number(el.adults)
        children+=Number(el.children)
        if(el.planType && el.planType.trim()!=="" && !plans[0][el.planType]){
          plans[0][el.planType] = Number(el.adults)
          plans[1][el.planType] = Number(el.children)
        }else if(el.planType && el.planType.trim()!=="" ){
          plans[0][el.planType] = Number(plans[0][el.planType])+Number(el.adults)
          plans[1][el.planType] = Number(plans[1][el.planType])+Number(el.children)
        }
        if(el.guestName && el.guestName.trim()!=="" && moment(el.arraivalDate).format('D.MMM.YYYY') === moment().format('D.MMM.YYYY')){
          occupied+=1
        }else if(el.guestName && el.guestName.trim()!=="" && moment(el.arraivalDate).format('D.MMM.YYYY') !== moment().format('D.MMM.YYYY')){
          continuing+=1
        }
        return([
          el.roomNumber1,
          el.guestName,
          el.planType,
          el.pax,
          el.arraivalDate?moment(el.arraivalDate).format('D.MMM.YYYY'):"",
          el.departureDate?moment(el.departureDate).format('D.MMM.YYYY'):"",
          el.stay,
        ])
      })
      console.log("plans",plans,adults,children)
      let data2 =[]
      data2.push(["TOTAL NO OF PAX :",adults+children+`(${adults}+${children})`])
      data2.push(["ADULTS :",adults])
      data2.push(["CHILDREN :",children])
      Object.keys(plans[0]).map(el=>{
        data2.push([el+":",Number(plans[0][el])+Number(plans[1][el])+"("+plans[0][el]+"+"+plans[1][el]+")"])
      })
      exportDailyOccupantToPDF(data,data2,Number(occupied)+Number(continuing),occupied)
    }
  } 
  
//Export Daily occupancy pdf
    const exportDailyOccupantToPDF = (reportData,data2,occupied,continuing) =>{
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape
    const marginLeft = 20;
    const marginLeft2 = 350;
    const date = moment().format('D.MMM.YYYY')
    const day = moment().format('dddd')
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(20);
    let title = "DAILY OCCUPANCY CHART";
    let headers = [["ROOM NO", "NAME OF GUEST","PLAN TYPE","PAX","DT. OF ARR","DT. OF DEPT","STAY"]];
    let content = {
      startY: 120,
      head: headers,
      body: reportData,
      theme: 'striped',
      styles: {
        cellWidth:'wrap',
        halign : "left",
      },
      headerStyles: {
        fillColor: "#0088bc",
      },
      margin: marginLeft,
      pageBreak:'auto'
    };
    doc.text(title, 300, 80);
    doc.setFontSize(10);
    doc.text("Report Generated at "+generatedTime,600,20);
    doc.setFontSize(12);
    doc.text("DATE : "+ date,30,60)
    doc.text("DAY : "+ day,30,80)
    doc.text("TOTAL OCCUPIED : "+ occupied,650,60)
    doc.text("TODAY'S CHECKIN : "+ continuing,650,80)
    doc.setFontSize(12);
    doc.autoTable(content);
    doc.setTextColor("#fb3640");
    doc.autoTable({
      startY: doc.lastAutoTable.finalY,
      // head: headers,
      body: data2,
      theme: 'grid',
      styles: {
        cellWidth:'wrap',
        halign : "left",
      },
      bodyStyles: {
        textColor: "#e84545"
      },
      margin: marginLeft,
      pageBreak:'auto'
    });
    doc.save("Daily Occupancy Report.pdf")
  }
///
  return (
    <React.Fragment>
      <Button
        aria-controls="pos-menu"
        aria-haspopup="true"
        className={classes.btnPOS}
        color="inherit"
        onMouseOver={event => handleOpenAdvanceMenu(event)}
      >
        <UpdateIcon/>
        Utility
      </Button>
      <Menu
        id="pos-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAdvanceMenu}
       >
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Advance Collection")}>Advance</MenuItem>
           <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Today's Checkin", "md")}>Today's Checkin</MenuItem>
           <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Today's Checkout", "md")}>Today's Checkout</MenuItem>
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Bill Settlement")}>Bill Settlement</MenuItem>
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Approximate Bill")}>Approximate Bill</MenuItem>
          <MenuItem onClick={()=>fetchAndGenerateDailyOccupanyReport()}>Occupancy Chart</MenuItem>
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Guest Details","md")}>Guest Details</MenuItem>
          <MenuItem onClick={()=>handleOpenAdvanceTabMenu("Print Bill","md")}>Print Bill</MenuItem>
          <MenuItem onClick={()=>handleCloseAdvanceMenu}>Petty Cash</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AdvancedMenu;
