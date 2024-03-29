import React,{useState,useEffect} from 'react'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import TextField from '@material-ui/core/TextField';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import { DialogContent,DialogTitle,Typography,Button,makeStyles} from "@material-ui/core";
import inventory from '../../services/inventory';
import constants from "../../utils/constants";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Loader from "../../common/Loader/Loader";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import Fuse from 'fuse.js'
import { GiBroom } from 'react-icons/gi';


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
const HouseKeepingInventory = ({onSnackbarEvent}) => {
    const classes = useStyles();
    const [houseKeeping,sethouseKeeping] = useState({
        item : '',
        unit : '',
        price: ''
    })
  const [houseKeepings,setHouseKeepings] = useState([])
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState({});

    useEffect(() => {
    setLoading(true);
        fetchFoods()
       
    }, [])

   const fetchFoods = async () => {
       const items = await inventory.getHouseKeepingItems();
       if(items){
        setHouseKeepings(items);
            setLoading(false);           
       }
   }
   //Snackbar
   const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    onSnackbarEvent(snakbarObj);
  };

  //Handle Changes
  const [unit, setUnit] = React.useState('');

  const handleChange = (event) => {
    setUnit(event.target.value);
    sethouseKeeping({
        ...houseKeeping,unit:event.target.value
    })
  };
  const handleEdit = (row) => {
    setEditingRow(row)
  }

  const handleUndo = () => {
    setEditingRow({})
  }

  const handleUpdateSelect=(event)=>{
    setEditingRow({
      ...editingRow,
      unit :event.target.value
    })
  }

  const tablestyles={
    color:'#0088bc',
    fontWeight:"bold"
   }
   const handleUpdate = async () => {
    setLoading(true);
    const res = await inventory.updateHouseKeepingItem(editingRow);
    setLoading(false);
    if(res){
      openSnackBar("Item Updated Successfully", success);
      setEditingRow({})
      setLoading(true);
      fetchFoods()
    }
  }

   const handleInputChange = (e) => {
    setEditingRow({
      ...editingRow,
      [e.target.name]:e.target.value
    })
  }
  const handleDelete = async (row) => {
    setLoading(true);
    const res = await inventory.deleteHouseKeepingItem(row);
    setLoading(false);
    if(res){
      openSnackBar("Item Deleted Successfully", success);
      setLoading(true);
      fetchFoods()
    }
  }
    //handleSubmit
      const handleSubmit = async(event)=>{
          event.preventDefault();
            if(houseKeeping){
              const options = {
                includeScore: true,
                threshold : 0.1,
                keys: ['item']
              }
              const fuse = new Fuse(houseKeepings, options)
              const result = fuse.search(houseKeeping.item)
             if(result.length !== 0){
              openSnackBar("Item Already Exist", error);
              }
              else{
              console.log("BEFORE Response",houseKeeping)           
             const response = await inventory.addHouseKeepingItem(houseKeeping);
                console.log("After Response",response)
                if(response){
                openSnackBar("Item Added Successfully", success);
                setLoading(true);
               fetchFoods()
              }else {
                openSnackBar("Error Occured", error);
              }
             }
            console.log("Food",houseKeeping)
          }
    }
    return (
        <div>
        <DialogTitle><GiBroom/> Add Item</DialogTitle>
        <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off">
          <TextField required id="standard-required" label="Item Name" name="season" value={houseKeeping.item} 
          onChange={(event)=>sethouseKeeping({...houseKeeping,item: event.target.value})} />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Unit</InputLabel>
              <Select
               labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={unit}
                onChange={handleChange}
                required
              >
                      <MenuItem value="BOX">BOX</MenuItem>
                      <MenuItem value="PACKET">PACKET</MenuItem>
                      <MenuItem value="ITEM">ITEM</MenuItem>
                     </Select>
            </FormControl>
          <TextField required id="standard-required" label="Price" name="season"
          value={houseKeeping.price}
          onChange={(event)=>sethouseKeeping({...houseKeeping,price: event.target.value})}/>
          <Button 
          type="submit" 
          variant="contained" 
          style={{backgroundColor:"#0088bc",color:'white'}}
          onClick={handleSubmit}
          >
            ADD ITEM
          </Button>
        </form>
        {loading && <Loader color="#0088bc" />}
        <TableContainer className={classes.table} component={Paper}>
          <Table className={classes.table} size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={tablestyles}>ID</TableCell>
                <TableCell align="center" style={tablestyles}>ITEM</TableCell>
                <TableCell align="center" style={tablestyles}>UNIT</TableCell>
                <TableCell align="center" style={tablestyles}>PRICE</TableCell>
                <TableCell align="center" style={tablestyles}>Edit</TableCell>
                <TableCell align="center" style={tablestyles}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {houseKeepings.map((row,i) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {i+1}
                  </TableCell>
                  {editingRow._id !== row._id && <TableCell align="center">{row.item}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Item Name" name="item" value={editingRow.item} onChange={handleInputChange}/>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.unit}</TableCell>}
                  {editingRow._id === row._id &&<TableCell align="center">
                     <FormControl>
                    <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                    <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={editingRow.unit}
                      onChange={handleUpdateSelect}
                      required
                       >
                      <MenuItem value="BOX">BOX</MenuItem>
                      <MenuItem value="PACKET">PACKET</MenuItem>
                      <MenuItem value="ITEM">ITEM</MenuItem>
                     </Select>
                     </FormControl>
                  </TableCell>}
                  {editingRow._id !== row._id && <TableCell align="center">{row.price}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="price" name="price" value={editingRow.price} onChange={handleInputChange}/>
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
        </DialogContent>
        </div>
    )
}

export default HouseKeepingInventory
