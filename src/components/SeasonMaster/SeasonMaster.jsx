import React, { useEffect, useState } from "react";
import seasonService from "../../services/seasonService";

import Loader from "../../common/Loader/Loader";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from "moment";

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

const SeasonMaster = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [newDoc, setNewDoc] = useState({
    fromDate: null,
    toDate: null,
  });
  const [editingRow, setEditingRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [openRateCopyDialog, setOpenRateCopyDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const rooms = await seasonService.getSeason();
    setRooms(rooms);
    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setOpenRateCopyDialog(true)
  }
 
  const addSeason= async(flag)=>{
    setOpenRateCopyDialog(false)
    setLoading(true);
    const res = await seasonService.addSeason(newDoc,flag);
    setLoading(false);
    if(res.status===201 || res.status===200){
      // setNewDoc({})
      setLoading(true);
      fetchData()
    }else {
      console.log(res)
      setNewDoc({})
      alert("Bad Request")
    }
  }

  const handleUpdate = async () => {
    setLoading(true);
    const res = await seasonService.updateSeason(editingRow);
    setLoading(false);
    if(res){
      setEditingRow({})
      setLoading(true);
      fetchData()
    }
  }

  const handleDelete = async (row) => {
    return
    setLoading(true);
    const res = await seasonService.deleteSeason(row);
    setLoading(false);
    if(res){
      setLoading(true);
      fetchData()
    }
  }

  const handleInput = (e) => {
    setNewDoc({
      ...newDoc,
      [e.target.name]:e.target.value
    })
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

  const handleFromDateChange = (date) => {
    setEditingRow({
      ...editingRow,
      fromDate:date
    })
  };

  const handleToDateChange = (date) => {
    setEditingRow({
      ...editingRow,
      toDate:date
    })
  };

  const handleNewFromDateChange = (date) => {
    setNewDoc({
      ...newDoc,
      fromDate:date
    })
  };

  const handleNewToDateChange = (date) => {
    setNewDoc({
      ...newDoc,
      toDate:date
    })
  };
  //Tables Color
  const tablestyles={
    color:'#0088bc',
    fontWeight:"bold"
   }


  return (
    <React.Fragment>
      <DialogTitle>Seasons</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off" onSubmit={handleFormSubmit}>
          <TextField required id="standard-required" label="Season" name="season" onChange={handleInput}/>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              required
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Start date"
              name="fromDate"
              value={newDoc.fromDate}
              onChange={handleNewFromDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              required
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="End date"
              name="toDate"
              value={newDoc.toDate}
              onChange={handleNewToDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <Button 
          type="submit" 
          variant="contained" 
          style={{backgroundColor:"#0088bc",color:'white'}} >
            ADD
          </Button>
        </form>
        {loading && <Loader color="#0088bc" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={tablestyles}>ID</TableCell>
                <TableCell align="center" style={tablestyles}>Season</TableCell>
                <TableCell align="center" style={tablestyles}>Start Date</TableCell>
                <TableCell align="center" style={tablestyles}>End Date</TableCell>
                <TableCell align="center" style={tablestyles}>Edit</TableCell>
                <TableCell align="center" style={tablestyles}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((row,i) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {i+1}
                  </TableCell>
                  {editingRow._id !== row._id && <TableCell align="center">{row.season}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Season" name="season" value={editingRow.season} onChange={handleInputChange}/>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{moment(row.fromDate).format("Do MMMM YYYY")}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        required
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Start date"
                        name="fromDate"
                        value={editingRow.fromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{moment(row.toDate).format("Do MMMM YYYY")}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        required
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="End date"
                        name="toDate"
                        value={editingRow.toDate}
                        onChange={handleToDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">
                    {row._id!=="5d3edc251c9d4400006bc08e" && <EditOutlinedIcon style={{cursor:"pointer"}} onClick={()=>handleEdit(row)}/>}
                  </TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <ReplayOutlinedIcon style={{cursor:"pointer"}} onClick={handleUndo}/>
                    <SaveOutlinedIcon style={{cursor:"pointer"}} onClick={handleUpdate}/>
                  </TableCell>}
                  <TableCell align="center">
                    {row._id!=="5d3edc251c9d4400006bc08e" && <DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}} onClick={()=>handleDelete(row)}/>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={openRateCopyDialog}
          onClose={()=>setOpenRateCopyDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Copy Rate from Regular?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The existing Regular Rates will be copied to this Season Rates
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>addSeason(false)} color="primary">
              Disagree
            </Button>
            <Button onClick={()=>addSeason(true)} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>
    </React.Fragment>
  );
};

export default SeasonMaster;
