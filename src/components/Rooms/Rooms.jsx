import React, { useEffect, useState } from "react";
import roomService from "../../services/roomService";
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

// const roomTypes = [
//   { label: "AC", value: "AC" },
//   { label: "Non AC", value: "Non AC" },
//   { label: "Deluxe", value: "Deluxe" },
//   { label: "Suite", value: "Suite" },
//   { label: "Dormitory", value: "Dormitory" }
// ];

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

const RoomCategory = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDoc, setNewDoc] = useState({});
  const [editingRow, setEditingRow] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchRoomTypes();
  }, []);

  const fetchData = async () => {
    const rooms = await roomService.getRooms();
    setRooms(rooms);
    setLoading(false);
  };

  const fetchRoomTypes = async () => {
    const rooms = await roomTypeService.getRoomsTypes();
    setRoomTypes(rooms);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await roomService.addRoom(newDoc);
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

  const handleInput = (e) => {
    setNewDoc({
      ...newDoc,
      [e.target.name]:e.target.value
    })
  }

  const handleEdit = (row) => {
    setEditingRow(row)
  }

  const handleUndo = () => {
    setEditingRow({})
  }

  const handleUpdate = async () => {
    setLoading(true);
    const res = await roomService.updateRoom(editingRow);
    setLoading(false);
    if(res){
      setEditingRow({})
      setLoading(true);
      fetchData()
    }
  }

  const handleDelete = async (row) => {
    setLoading(true);
    const res = await roomService.deleteRoom(row);
    setLoading(false);
    if(res){
      setLoading(true);
      fetchData()
    }
  }

  const handleInputChange = (e) => {
    setEditingRow({
      ...editingRow,
      [e.target.name]:e.target.value
    })
  }

  return (
    <React.Fragment>
      <DialogTitle>Rooms</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
          <TextField required id="standard-required" label="Room Number" name="roomNumber" onChange={handleInput}/>
          {/* <TextField required id="standard-required" label="Floor" name="Floor"/> */}
          {/* <TextField required id="standard-required" label="Rate" name="roomRate"/> */}
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
          <Button 
            type="submit" 
            variant="contained"
            style={{backgroundColor:"#56B1EE",color:'white'}}
            >
            ADD
          </Button>
        </form>
        {loading && <Loader color="inherit" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Sl No.</TableCell>
                <TableCell align="center">Room Number</TableCell>
                <TableCell align="center">Room Type</TableCell>
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
                  {editingRow._id !== row._id && <TableCell align="center">{row.roomNumber}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Room Number" name="roomNumber" value={editingRow.roomNumber} onChange={handleInputChange}/>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.roomType}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                  <FormControl style={{width:"100%"}}>
                    <InputLabel id="demo-simple-select-label">Room Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      required
                      name="roomType"
                      value={newDoc.roomType}
                      onChange={handleInputChange}
                      >
                      {roomTypes.map(el=><MenuItem value={el.roomType}>{el.roomType}</MenuItem>)}
                    </Select>
                  </FormControl>
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

export default RoomCategory;
