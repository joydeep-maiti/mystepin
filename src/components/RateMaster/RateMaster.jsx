import React, { useEffect, useState } from "react";
import seasonService from "../../services/seasonService";
import roomTypeService from "../../services/roomTypeService";

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

const rateData = [{
  _id:"604490bd794f4b0b55171a7d",
  roomType:"Non AC",
  planType:"AP",
  extraRate:500,
  rate:1000,
  seasonId:"5d3edd4c1c9d4400006bc08f",
  seasonDetails: [{
    season:"Diwali"
  }]
}]

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
    color: "#f50057"
  },
  table: {
    // maxWidth: 650,
    maxHeight: "70vh"
  },
  roomsDiv:{
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));

const RateMaster = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([{
    _id:"604490bd794f4b0b55171a7d",
    roomType:"Non AC",
    planType:"AP",
    extraRate:500,
    rate:1000,
    seasonId:"5d3edd4c1c9d4400006bc08f",
    seasonDetails: [{
      season:"Diwali"
    }]
  }]);
  const [newDoc, setNewDoc] = useState({});
  const [editingRow, setEditingRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [planTypes, setPlanTypes] = useState([
    {planType:"AP"},
    {planType:"CP"},
    {planType:"MAP"},
  ]);

  useEffect(() => {
    setLoading(true);
    // fetchData();
    fetchRoomTypes();
    fetchSeasons()
  }, []);

  const fetchData = async () => {
    const rooms = await seasonService.getSeason();
    setRooms(rooms);
    setLoading(false);
  };

  const fetchSeasons = async () => {
    setLoading(true);
    const seasons = await seasonService.getSeason();
    setSeasons(seasons);
    setLoading(false);
  };

  const fetchRoomTypes = async () => {
    setLoading(true);
    const rooms = await roomTypeService.getRoomsTypes();
    setRoomTypes(rooms);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    return
    setLoading(true);
    const res = await seasonService.addSeason(newDoc);
    setLoading(false);
    if(res.status===201){
      setNewDoc({})
      setLoading(true);
      fetchData()
    }else {
      console.log(res)
      setNewDoc({})
      alert("Bad Request")
    }

  }

  const handleUpdate = async () => {
    return
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


  return (
    <React.Fragment>
      <DialogTitle>Rate Master</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Room Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="roomType"
              value={newDoc.roomType}
              onChange={handleInput}
              >
              {roomTypes.map(el=><MenuItem value={el.roomType}>{el.roomType}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Plan Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="roomType"
              value={newDoc.planType}
              onChange={handleInput}
              >
              {planTypes.map(el=><MenuItem value={el.planType}>{el.planType}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Season</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="seasonId"
              value={newDoc.seasonId}
              onChange={handleInput}
              >
              {seasons.map(el=><MenuItem value={el._id}>{el.season}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField type="number" required id="standard-required" label="Rate" name="rate" onChange={handleInput}/>
          <TextField type="number" required id="standard-required" label="Extra Rate" name="extraRate" onChange={handleInput}/>

          <Button 
          type="submit" 
          variant="contained" color="primary">
            ADD
          </Button>
        </form>
        {loading && <Loader color="primary" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Sl No.</TableCell>
                <TableCell align="center">Room Type</TableCell>
                <TableCell align="center">Plan Type</TableCell>
                <TableCell align="center">Season</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Extra Rate/Person</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((row,i) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {i+1}
                  </TableCell>
                  <TableCell align="center">{row.roomType}</TableCell>
                  <TableCell align="center">{row.planType}</TableCell>
                  <TableCell align="center">{row.seasonDetails[0].season}</TableCell>
                  {editingRow._id !== row._id && <TableCell align="center">{row.rate}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Rate" name="rate" value={editingRow.rate} onChange={handleInputChange}/>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.extraRate}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Extra Rate" name="extraRate" value={editingRow.extraRate} onChange={handleInputChange}/>
                  </TableCell>}
                  
                  {editingRow._id !== row._id && <TableCell align="center"><EditOutlinedIcon style={{cursor:"pointer"}} onClick={()=>handleEdit(row)}/></TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <ReplayOutlinedIcon style={{cursor:"pointer"}} onClick={handleUndo}/>
                    <SaveOutlinedIcon style={{cursor:"pointer"}} onClick={handleUpdate}/>
                  </TableCell>}
                  <TableCell align="center"><DeleteOutlineOutlinedIcon  style={{cursor:"pointer"}} onClick={()=>handleDelete(row)}/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </React.Fragment>
  );
};

export default RateMaster;
