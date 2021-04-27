import React, { useEffect, useState } from "react";
import seasonService from "../../services/seasonService";
import roomTypeService from "../../services/roomTypeService";
import ratemasterService from "../../services/ratemasterService";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
    color: "#0088bc"
  },
  table: {
    maxWidth: 1400,
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
  const [rooms, setRooms] = useState([]);
  const [newDoc, setNewDoc] = useState({percent:null});
  const [editingRow, setEditingRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [percentView, setPercentView] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [ratePercents, setRatePercents] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [planTypes, setPlanTypes] = useState([
    {planType:"AP"},
    {planType:"CP"},
    {planType:"EP"},
    {planType:"MAP"},
  ]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    fetchRoomTypes();
    fetchSeasons();
    fetchRatePercent();
  }, []);

  // useEffect(() => {
  //   let obj = {}
  //   seasons && ratePercents && seasons.forEach(el=>{
  //     sratePercents.find()
  //   })
  // },[ratePercents]);

  const fetchData = async () => {
    const rooms = await ratemasterService.getRate();
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

  const fetchRatePercent = async () => {
    setLoading(true);
    const rooms = await ratemasterService.getRatepercent();
    // console.log("fetchRatePercent",rooms)
    setRatePercents(rooms);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let data = {...newDoc}
    delete data.percent;
    const res = await ratemasterService.addRate(data);
    setLoading(false);
    if(res.status===201){
      // setNewDoc({})
      setLoading(true);
      fetchData()
    }else {
      console.log(res)
      setNewDoc({})
      alert("Bad Request")
    }

  }

  const handlePercentFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await ratemasterService.updateRateByPercent(newDoc);
    setLoading(false);
    if(res){
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
    const res = await ratemasterService.updateRate(editingRow);
    setLoading(false);
    if(res){
      setEditingRow({})
      setLoading(true);
      fetchData()
      fetchRatePercent()
    }
  }

  const handleDelete = async (row) => {
    return
    setLoading(true);
    const res = await ratemasterService.deleteRate(row);
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
    if(e.target.name === "seasonId"){
      let obj = ratePercents.find(el => el.seasonId === e.target.value)
      console.log("obj",obj)
      setNewDoc({
        ...newDoc,
        percent: obj.percent
      })
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

  const handleSwitch = (event) => {
    setPercentView(event.target.checked)
  };

  return (
    <React.Fragment>
      <DialogTitle>
        Rate Master
        <FormControlLabel
          control={
            <Switch
              checked={percentView}
              onChange={handleSwitch}
              name="percentView"
              color="primary"
            />
          }
          label="Percentage View"
          style={{float:"right"}}
        />
      </DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        {!percentView && <form className={classes.formGroup} autoComplete="off" onSubmit={handleFormSubmit}>
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
              name="planType"
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
          <TextField type="number" required id="standard-required" label="Rate" name="rate" onChange={handleInput} value={newDoc.rate} inputProps={{min:0, step:.01}}/>
          <TextField type="number" required id="standard-required" label="Extra Rate" name="extraRate" onChange={handleInput} value={newDoc.extraRate}  inputProps={{min:0, step:.01}}/>
          <Button 
          type="submit" 
          variant="contained"
          style={{backgroundColor:"#0088bc",color:'white'}}
          >
            ADD
          </Button>
        </form>}
        {percentView && <form className={classes.formGroup} autoComplete="off" onSubmit={handlePercentFormSubmit}>
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
          <TextField 
            type="number" 
            value={newDoc.percent === 0?"0":newDoc.percent} 
            required id="standard-required" 
            label="Percentage" 
            name="percent" 
            inputProps={{min:0, max:100, step:.01}} 
            onChange={handleInput}
            InputLabelProps={{ shrink: newDoc.percent===0?true:newDoc.percent }}
          />
          <Button 
          type="submit" 
          variant="contained"
          style={{backgroundColor:"#0088bc",color:'white'}}
          >
            SUBMIT
          </Button>
        </form>}
        {loading && <Loader color="#0088bc" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={tablestyles}>ID</TableCell>
                <TableCell align="center" style={tablestyles}>Season</TableCell>
                <TableCell align="center" style={tablestyles}>Room Type</TableCell>
                <TableCell align="center" style={tablestyles}>Plan Type</TableCell>
                <TableCell align="center" style={tablestyles}>Rate</TableCell>
                <TableCell align="center" style={tablestyles}>Extra Rate/Person</TableCell>
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
                  <TableCell align="center">{row.seasondetails.season}</TableCell>
                  <TableCell align="center">{row.roomType}</TableCell>
                  <TableCell align="center">{row.planType}</TableCell>
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
