import React, { useEffect, useState } from "react";
import accessService from "../../services/accessService";

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
  roomsDiv: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));
const AccessMngmt = ({ onClose }) => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [roles, setRoles] = useState([
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "General Manager", value: "General Manager" },
    { label: "Staff", value: "Staff" },
  ]);
  const [departments, setDepartment] = useState([
    { label: "Front Office", value: "Front Office" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Finance", value: "Finance" },
    { label: "Operations", value: "Operations" },
    { label: "House Keeping", value: "House Keeping" },
  ]);
  const permissions = {
    Configuration: ["Rooms", "Room Category", "Rate Master", "Season Master", "Taxes", "Property Details", "User Management", "Inventory", "Access Management"],
    Reports: ["Billing Details", "Booking", "POS Sales", "Agent", "Occupancy", "Collection Report", "Guest Details"],
    Others: ["Utility", "POS", "Room Chart Read", "Room Chart Write"]
  }
  const [loading, setLoading] = useState(false);
  const [newDoc, setNewDoc] = useState({});
  const [editingRow, setEditingRow] = useState();
  const [checkbox, setCheckbox] = useState(false);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    // setLoading(true);
    // fetchData();
    // buildData()
  }, []);

  const handleFormSubmit = async (e) => {
    console.log("newdoc", newDoc)
    e.preventDefault();
    setLoading(true);
    const res = await accessService.getAcess(newDoc);
    setLoading(false);
    console.log(res)
    if (res && res.status === 200) {
      setEditingRow({
        role:res.data.role || newDoc.role,
        department:res.data.department || newDoc.department,
        permissions:res.data.permissions || []
      })
      setDisable(false)
    } else {
      console.log(res)
      setEditingRow(null)
      alert("Bad Request")
    }

  }

  const handleInput = (e) => {
    setNewDoc({
      ...newDoc,
      [e.target.name]: e.target.value
    })
    setDisable(true)
  }

  const handleEdit = (row) => {
    setEditingRow(row)
    console.log("row", row);
  }


  const handleUndo = () => {
    setEditingRow({})
  }

  const handleUpdate = async () => {
    console.log("editingRow", editingRow)
    setLoading(true);
    const res = await accessService.updateAccess(editingRow);
    setLoading(false);
    if (res) {
    }
  }

  const handleCheckBoxChange = (e) => {
    // return
    console.log(e.target.name, e.target.checked)
    let _permission = e.target.name
    let _checked = e.target.checked
    let userPermissions = editingRow.permissions || []
    if (_checked) {
      userPermissions.push(_permission)
    } else {
      userPermissions.splice(userPermissions.indexOf(_permission))
    }
    let _doc = { ...editingRow }
    _doc.permissions = userPermissions
    setNewDoc(_doc)
  }

  const handleInputChange = (e) => {
    setEditingRow({
      ...editingRow,
      [e.target.name]: e.target.value
    })
  }
  //Styles to Table Headers
  const tablestyles = {
    color: '#0088bc',
    fontWeight: "bold",
    fontSize: "1rem"
  }
  return (
    <React.Fragment>
      <DialogTitle>Access Management</DialogTitle>
      <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off" onSubmit={handleFormSubmit}>
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
              {departments.map(el => <MenuItem value={el.value}>{el.label}</MenuItem>)}
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
              {roles.map(el => <MenuItem value={el.value}>{el.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#0088bc", color: 'white' }}
          >
            SUBMIT
          </Button>
        </form>
        {loading && <Loader color="#0088bc" />}
        {editingRow && <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableBody>
              {Object.keys(permissions).map(el => {
                return (
                  <TableRow>
                    <TableCell style={tablestyles} rowSpan={1}>{el}</TableCell>
                    <TableCell>
                      <div>
                        {permissions[el].map(permission => {
                          return (
                            <FormControl style={{ width: "15rem" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={editingRow.permissions ? editingRow.permissions.includes(permission) : false}
                                    onChange={handleCheckBoxChange}
                                    name={permission}
                                    color="primary"
                                  />
                                }
                                label={permission}
                                style={{ minWidth: "max-content", marginLeft: "0.3rem" }}
                              ></FormControlLabel>
                            </FormControl>)
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>}
      </DialogContent>
      <DialogActions style={{paddingRight:"24px"}}>
        {editingRow && 
        <Button onClick={handleUpdate} autoFocus variant="contained" 
          style={disable?{ backgroundColor: "rgba(0, 0, 0, 0.12)", color: 'rgba(0, 0, 0, 0.26)' }:{ backgroundColor: "#0088bc", color: 'white' }} 
          disabled={disable}>
          SAVE
        </Button>}
      </DialogActions>
    </React.Fragment>
  );
};

export default AccessMngmt;
