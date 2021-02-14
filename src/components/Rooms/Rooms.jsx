import React, { useEffect, useState } from "react";
import roomService from "../../services/roomService";

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

const roomTypes = [
  { label: "AC", value: "AC" },
  { label: "Non AC", value: "Non AC" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Dormitory", value: "Dormitory" }
];

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

const Rooms = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    const rooms = await roomService.getRooms();
    setRooms(rooms);
    setLoading(false);
  };

  return (
    <React.Fragment>
      <DialogTitle>Rooms</DialogTitle>
      {loading && <Loader color="primary" />}
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} noValidate autoComplete="off">
          <TextField required id="standard-required" label="Room Number" name="roomNumber"/>
          <TextField required id="standard-required" label="Floor" name="Floor"/>
          <TextField required id="standard-required" label="Rate" name="roomRate"/>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Room Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="roomType"
              // value={age}
              // onChange={handleChange}
            >
              {roomTypes.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            ADD
          </Button>
        </form>
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Sl No.</TableCell>
                <TableCell align="center">Room Number</TableCell>
                <TableCell align="center">Floor</TableCell>
                <TableCell align="center">Rate</TableCell>
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
                  <TableCell align="center">{row.roomNumber}</TableCell>
                  <TableCell align="center">{row.Floor}</TableCell>
                  <TableCell align="center">{row.roomRate}</TableCell>
                  <TableCell align="center">{row.roomType}</TableCell>
                  <TableCell align="center"><EditOutlinedIcon/></TableCell>
                  <TableCell align="center"><DeleteOutlineOutlinedIcon/></TableCell>
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
