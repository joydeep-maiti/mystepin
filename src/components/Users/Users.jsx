import React, { useEffect, useState } from "react";
import roomService from "../../services/roomService";
import userService from "../../services/userService";
import { roles, departments } from '../../utils/enums'
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
const Users = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  // const [roles, setRoles] = useState([
  //   { label: "Admin", value: "Admin" },
  //   { label: "Manager", value: "Manager" },
  //   { label: "General Manager", value: "General Manager" },
  //   { label: "Staff", value: "Staff" },
  // ]);
  // const [departments, setDepartment] = useState([
  //   { label: "Front Office", value: "Front Office" },
  //   { label: "Restaurant", value: "Restaurant" },
  //   { label: "Finance", value: "Finance" },
  //   { label: "Operations", value: "Operations" },
  //   { label: "House Keeping", value: "House Keeping" },
  //   { label: "IT", value: "IT" },
  // ]);
  const [loading, setLoading] = useState(false);
  const [newDoc, setNewDoc] = useState({});
  const [editingRow, setEditingRow] = useState({});
  const [checkbox,setCheckbox]=useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);


  const fetchData = async () => {
    const rooms = await userService.getUsers();
    setRooms(rooms);
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await userService.addUser(newDoc);
    setLoading(false);
    if(res.status===201){
      // setNewDoc({})
      setLoading(true);
      fetchData()
    }else {
      console.log(res)
      // setNewDoc({})
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
    console.log("row",row);
  }
  

  const handleUndo = () => {
    setEditingRow({})
  }

  const handleUpdate = async () => {
    setLoading(true);
    const res = await userService.updateUser(editingRow);
    setLoading(false);
    if(res){
      setEditingRow({})
      setLoading(true);
      fetchData()
    }
  }

  const handleDelete = async (row) => {
    // return
    setLoading(true);
    const res = await userService.deleteUser(row);
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
  //Styles to Table Headers
  const tablestyles={
   color:'#0088bc',
   fontWeight:"bold"
  }
  return (
    <React.Fragment>
      <DialogTitle>User Management</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off" onSubmit={handleFormSubmit}>
          <TextField required id="standard-required" label="Username" name="username" onChange={handleInput}/>
          <TextField required id="standard-required" label="Password" name="password" onChange={handleInput}/>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Department*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="department"
              value={newDoc.department}
              onChange={handleInput}
              >
              {departments.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Role*</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              required
              name="role"
              value={newDoc.role}
              onChange={handleInput}
              >
              {roles.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
            </Select>
          </FormControl>
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
                <TableCell style={tablestyles}>ID</TableCell>
                <TableCell align="center" style={tablestyles}>Username</TableCell>
                <TableCell align="center" style={tablestyles}>Password</TableCell>
                <TableCell align="center" style={tablestyles}>Department</TableCell>
                <TableCell align="center" style={tablestyles}>Role</TableCell>
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
                  <TableCell align="center">{row.username}</TableCell>
                  {editingRow._id !== row._id && <TableCell align="center">{row.password}</TableCell>} 
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Password" name="password" value={editingRow.password} onChange={handleInputChange}/>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.department}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                  <FormControl style={{width:"100%"}}>
                    <InputLabel id="demo-simple-select-label">Department*</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      required
                      name="department"
                      value={editingRow.department}
                      onChange={handleInputChange}
                      >
                      {departments.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.role}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                  <FormControl style={{width:"100%"}}>
                    <InputLabel id="demo-simple-select-label">Role*</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      required
                      name="role"
                      value={editingRow.role}
                      onChange={handleInputChange}
                      >
                      {roles.map(el=><MenuItem value={el.value}>{el.label}</MenuItem>)}
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

export default Users;
