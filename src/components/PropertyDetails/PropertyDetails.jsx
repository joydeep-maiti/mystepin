import React,{useEffect,useState} from 'react';
import propertyDetails from '../../services/propertyDetails'

import Loader from "../../common/Loader/Loader";
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    makeStyles
  } from "@material-ui/core";
  import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import TextField from '@material-ui/core/TextField';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from "moment";
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
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
      maxWidth:1400,
      maxHeight: "70vh"
    },
    roomsDiv:{
      display: "flex",
      flexFlow: "row wrap",
      alignItems: "flex-start",
      justifyContent: "center"
    }
  }));

  const tablestyles={
    color:'#0088bc',
    fontWeight:"bold"
   }

const PropertyDetails = ({ onSnackbarEvent }) =>{
  //variables
    const classes = useStyles();
    
      
   
//for useState and useEffect
const [loading, setLoading] = useState(false);
const [propertyD, setPropertyD] = useState([]);
const [editingRow, setEditingRow] = useState({});
const [newDoc, setNewDoc] = useState({});

useEffect(()=>{
  setLoading(true)
          fetchPropertyDetail()
        },[])
  
        //methods
        const fetchPropertyDetail = async()=>{
    
          const details = await propertyDetails.getPropertyDetails();
         
          setLoading(false);

          if(details){
            setPropertyD(details);
              console.log("Property details",details)
          }
      }
    const handleInput = (e) => {
      setNewDoc({
        ...newDoc,
        [e.target.name]:e.target.value
      })
    }
  
    const openSnackBar = (message, variant) => {
      const snakbarObj = { open: true, message, variant, resetBookings: false };
      onSnackbarEvent(snakbarObj);
    };
    //console.log("UPdated VAlue",editingRow)
    const handleUpdate = async () => {
      
      setLoading(true);
      const res = await propertyDetails.updatePropertyDetails(editingRow);
      setLoading(false);
      if(res){
        openSnackBar("Property Details Updated Successfully", success);
        setEditingRow({})
        setLoading(true);
        fetchPropertyDetail()
      }
    }

    const handleInputChange = (e) => {
      setEditingRow({
        ...editingRow,
        [e.target.name]:e.target.value
      })
    }
  
    const handleEdit = (row) => {
      setEditingRow(row)
    }
  
    const handleUndo = () => {
      setEditingRow({})
    }
        return (
           
                <React.Fragment>
                  <DialogTitle>Property Details</DialogTitle>
                  <DialogContent className={classes.roomsDiv}>
                    {loading && <Loader color="#0088bc" />}
                    <TableContainer className={classes.table} component={Paper}>
                      <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell style={tablestyles}>ID</TableCell>
                            <TableCell align="center" style={tablestyles}>Name</TableCell>
                            <TableCell align="center" style={tablestyles}>Address</TableCell>
                            <TableCell align="center" style={tablestyles}>GST No</TableCell>
                            <TableCell align="center" style={tablestyles}>Logo</TableCell>
                            <TableCell align="center" style={tablestyles}>Slogan</TableCell>
                            <TableCell align="center" style={tablestyles}>Website</TableCell>
                            <TableCell align="center" style={tablestyles}>Contact Number</TableCell>
                            <TableCell align="center" style={tablestyles}>WhatsApp</TableCell>
                            <TableCell align="center" style={tablestyles}>Edit</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {propertyD.map((row,i) => (
                            <TableRow key={row._id}>
                              <TableCell component="th" scope="row">
                                {i+1}
                              </TableCell>
                      {/* ******************** NAME  ******************** */}
                  { editingRow._id !== row._id && <TableCell align="center">{row.name}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Name" name="name" value={editingRow.name} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** ADDRESS  ******************** */}
                  { editingRow._id !== row._id && <TableCell align="center">{row.address}</TableCell>}     
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Address" name="address" value={editingRow.address} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** GSTNUMBER  ******************** */}
                    { editingRow._id !== row._id && <TableCell align="center">{row.gstNumber}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Gst" name="gstNumber" value={editingRow.gstNumber} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** LOGO  ******************** */}
                    { editingRow._id !== row._id && <TableCell align="center">{row.logo}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Logo" name="logo" value={editingRow.logo} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** SLOGAN  ******************** */}
                    {editingRow._id !== row._id &&  <TableCell align="center">{row.Slogan}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Slogan" name="Slogan" value={editingRow.Slogan} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** WEBSITE  ******************** */}
                    { editingRow._id !== row._id && <TableCell align="center">{row.Website}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Website" name="Website" value={editingRow.Website} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** CONTACT NUMBER  ******************** */}
                    { editingRow._id !== row._id && <TableCell align="center">{row.contactNumbers}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="ContactNo" name="contactNumbers" value={editingRow.contactNumbers} onChange={handleInputChange}/>
                  </TableCell>}
                   {/* ******************** WHATSAPP  ******************** */}
                    { editingRow._id !== row._id && <TableCell align="center">{row.whatspp}</TableCell>}
                    {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Whatsapp" name="whatspp" value={editingRow.whatspp} onChange={handleInputChange}/>
                  </TableCell>}

                  {editingRow._id !== row._id && <TableCell align="center">
                    {row._id!=="5d3edc251c9d4400006bc08e" && <EditOutlinedIcon style={{cursor:"pointer"}} onClick={()=>handleEdit(row)}/>}
                  </TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <ReplayOutlinedIcon style={{cursor:"pointer"}} onClick={handleUndo}/>
                    <SaveOutlinedIcon style={{cursor:"pointer"}} onClick={handleUpdate}/>
                  </TableCell>}

                            </TableRow>
                          ))}
                        </TableBody> 
                      </Table>
                    </TableContainer>
                    <ConfirmDialog 
                      //openDialog={openRateCopyDialog}
                      //setOpenDialog={setOpenRateCopyDialog}
                      title="Copy Rate from Regular?"
                      message="The existing Regular Rates will be copied to this Season Rates"
                      //handleSubmit={addSeason}
                    />
                    <ConfirmDialog 
                     // openDialog={openDeleteDialog}
                      //setOpenDialog={setOpenDeleteDialog}
                      title="Confirm Delete Season?"
                      message="The Rates associated with this Season will also be Deleted"
                      //handleSubmit={deleteSeason}
                    />
                  </DialogContent>
                </React.Fragment>
            
        );
    }





export default PropertyDetails;