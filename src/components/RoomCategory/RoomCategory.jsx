import React, { useEffect, useState } from "react";
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
    maxWidth: 1500,
    maxHeight: "70vh"
  },
  roomsDiv:{
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));

const Rooms = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [roomType, setNewRoomType] = useState({});
  const [editingRow, setEditingRow] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const rooms = await roomTypeService.getRoomsTypes();
    setRooms(rooms);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await roomTypeService.addRoomType(roomType);
    setLoading(false);
    if(res.status===201){
      setNewRoomType({})
      setLoading(true);
      fetchData()
    }else {
      console.log(res)
      setNewRoomType({})
      alert("Bad Request")
    }
  }

  const handleUpdate = async () => {
    setLoading(true);
    const res = await roomTypeService.updateRoomType(editingRow);
    setLoading(false);
    if(res){
      setEditingRow({})
      setLoading(true);
      fetchData()
    }
  }

  const handleDelete = async (row) => {
    setLoading(true);
    const res = await roomTypeService.deleteRoomType(row);
    setLoading(false);
    if(res){
      setLoading(true);
      fetchData()
    }
  }

  const handleInput = (e) => {
    setNewRoomType({
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

  return (
    <React.Fragment>
      <DialogTitle>Room Type</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} noValidate autoComplete="off" onSubmit={handleFormSubmit}>
          <TextField required id="standard-required" label="Room Type" name="roomType" onChange={handleInput}/>
          <Button 
          type="submit" 
          variant="contained" 
          style={{backgroundColor:"#0088bc",color:'white'}}          
          >
            ADD
          </Button>
        </form>
        {loading && <Loader color="#0088bc" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
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
                  {editingRow._id !== row._id && <TableCell align="center">{row.roomType}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Room Type" name="roomType" value={editingRow.roomType} onChange={handleInputChange}/>
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

export default Rooms;
