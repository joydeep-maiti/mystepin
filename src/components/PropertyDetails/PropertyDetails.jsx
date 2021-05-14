import React, { useEffect, useState } from 'react';
import propertyDetails from '../../services/propertyDetails'
import "./PropertyDetails.css"
import Loader from "../../common/Loader/Loader";
import {
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import ImageTile from "../../assets/Image.jpeg";
import LanguageIcon from "@material-ui/icons/Language";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PinDropIcon from "@material-ui/icons/PinDrop";
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import constants from "../../utils/constants";

const { success, error } = constants.snackbarVariants;

const useStyles = makeStyles(theme => ({
  formGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 20,
    '& > div': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  inputItems: {
    width: "70%"
  },
  span: {
    color: "#0088bc"
  },
  table: {
    maxWidth: 1400,
    maxHeight: "70vh"
  },
  roomsDiv: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));

const tablestyles = {
  color: '#0088bc',
  fontWeight: "bold"
}

function ActionBtnGrp(props) {
  return (
    <ButtonGroup disableElevation variant="contained" className="propertyIconBtn">
      <IconButton aria-label="Done" onClick={props.onOk}>
        <DoneIcon style={{ fontSize: "1rem", color: "white" }} />
      </IconButton>
      <IconButton aria-label="Close" onClick={props.onClose}>
        <CloseIcon style={{ fontSize: "1rem", color: "white" }} />
      </IconButton>
    </ButtonGroup>
  );
}

const PropertyDetails = ({ onSnackbarEvent }) => {
  //variables
  const classes = useStyles();



  //for useState and useEffect
  const [loading, setLoading] = useState(false);
  const [propertyD, setPropertyD] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [isEdit, setIsEdit] = useState(null)
  const [upload, setUpload] = useState(false)


  useEffect(() => {
    setLoading(true)
    fetchPropertyDetail()
  }, [])

  useEffect(() => {
    const nullable = ["",undefined,null]
    if(editingRow && !nullable.includes(editingRow.logo) && editingRow.logo!==propertyD.logo){
      handleUpdate()
    }
  }, [editingRow])

  //methods
  const fetchPropertyDetail = async () => {

    const details = await propertyDetails.getPropertyDetails();

    setLoading(false);

    if (details) {
      setPropertyD(details[0]);
      setEditingRow(details[0])
      console.log("Property details", details)
    }
  }
  // const handleInput = (e) => {
  //   setNewDoc({
  //     ...newDoc,
  //     [e.target.name]: e.target.value
  //   })
  // }

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    onSnackbarEvent(snakbarObj);
  };

  const handleUpdate = async () => {
    console.log("editingRow",editingRow)
    // e.preventDefault()
    // e.stopPropagation()
    // return
    let isNull = false
    Object.keys(editingRow).map(el => {
      if (editingRow[el] === "") {
        isNull = true
      }
    })
    if (isNull) {
      return
    }
    setLoading(true);
    const res = await propertyDetails.updatePropertyDetails(editingRow);
    setLoading(false);
    if (res) {
      openSnackBar("Property Details Updated Successfully", success);
      setLoading(true);
      fetchPropertyDetail()
    }
    setIsEdit(null)
  }

  const handleInputChange = (e) => {
    setEditingRow({
      ...editingRow,
      [e.target.name]: e.target.value
    })
    setIsEdit(e.target.name)
  }

  const handleEdit = (e) => {
    console.log(e)
    e.preventDefault()
    // if(e.target.name === isEdit)
    //   return

    // handleUndo()
  }

  const handleUndo = (e) => {
    e.stopPropagation();
    console.log("UNDO")
    setEditingRow(propertyD)
    setIsEdit(null)
  }

  const onFileSelect = async (event) =>{
    console.log(event.target.files[0])
    let reader = new FileReader();
    reader.onloadend = async function() {
      console.log('RESULT', reader.result)
      setEditingRow({
        ...editingRow,
        logo: reader.result
      })
      // handleUpdate()
      // const { status } = await bookingService.testBooking(data)
    }
    if(event.target.files[0]){
      reader.readAsDataURL(event.target.files[0]);
    }
}

  return (

    <React.Fragment>
      <DialogTitle>Property Details</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        {loading && <Loader color="#0088bc" />}
        {editingRow && <div className="prpertywrapper">
          <div style={{position:"relative"}}>
            <img className="prpertyImageTile" src={editingRow.logo}></img>
            <input
            accept="image/*"
            id="proofImage"
            type="file"
            onChange={onFileSelect}
            style={{display:"none"}}
          />
          <label htmlFor="proofImage">
            {/* <Button className="editIconBtn" style={{position:"absolute"}} variant="contained" component="span"> */}
            <EditIcon style={{position:"absolute", right:"1rem", cursor:"pointer"}}/>
            {/* </Button>  */}
            {/* <IconButton aria-label="Edit" className="editIconBtn" style={{position:"absolute"}}>
              <EditIcon />
            </IconButton style={{position:"absolute"}}> */}
          </label>
            
            
          </div>
          <div>
            <ClickAwayListener onClickAway={handleUndo}>
              <div className="propertyInputDiv">
                <input type="text" className="propertyName" value={editingRow.name} name="name" onChange={handleInputChange} autoComplete={false} />
                {isEdit === "name" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
              </div>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={handleUndo}>
              <div className="propertyInputDiv">
                <input type="text" className="propertySlogan" value={editingRow.Slogan} name="Slogan" onChange={handleInputChange} autoComplete={false} />
                {isEdit === "Slogan" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
              </div>
            </ClickAwayListener>
            <div>
              <div className="propertyDesc">
                <PinDropIcon style={{ color: "#F44336" }}></PinDropIcon>
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.address} name="address" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "address" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
              <div className="propertyDesc">
                <DescriptionIcon style={{ color: "#673AB7" }} />
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.gstNumber} name="gstNumber" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "gstNumber" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
              <div className="propertyDesc">
                <LanguageIcon style={{ color: "#FFC107" }}></LanguageIcon>
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.Website} name="Website" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "Website" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
              <div className="propertyDesc">
                <MailOutlineIcon style={{ color: "#303F9F" }}/>
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.email} name="email" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "email" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
              <div className="propertyDesc">
                <PhoneInTalkIcon style={{ color: "#607D8B" }}/>
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.contactNumbers} name="contactNumbers" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "contactNumbers" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
              <div className="propertyDesc">
                <WhatsAppIcon style={{ color: "#4CAF50" }}></WhatsAppIcon>
                <ClickAwayListener onClickAway={handleUndo}>
                  <div className="propertyInputDiv">
                    <input type="text" className="propertyInfo" value={editingRow.whatspp} name="whatspp" onChange={handleInputChange} autoComplete={false} />
                    {isEdit === "whatspp" && <ActionBtnGrp onOk={handleUpdate} onClose={handleUndo} />}
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          </div>
        </div>}
      </DialogContent>
    </React.Fragment>

  );
}





export default PropertyDetails;