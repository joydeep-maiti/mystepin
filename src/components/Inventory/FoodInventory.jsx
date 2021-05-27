import React,{useState,useEffect} from 'react'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import TextField from '@material-ui/core/TextField';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DialogContent,DialogTitle,Typography,Button,makeStyles} from "@material-ui/core";
import foodInventory from '../../services/foodInventory';
import constants from "../../utils/constants";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
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
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'


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
const FoodInventory = ({onSnackbarEvent}) => {
    const classes = useStyles();
    const [food,setFood] = useState({
        item : '',
        unit : '',
        price: ''
    })
  const [foods,setFoods] = useState([])
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState({});

    useEffect(() => {
    setLoading(true);
        fetchFoods()
       
    }, [])

   const fetchFoods = async () => {
       const items = await foodInventory.getFoodItems();
       if(items){
            setFoods(items);
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
    setFood({
        ...food,unit:event.target.value
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
    const res = await foodInventory.updateFoodItem(editingRow);
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
    const res = await foodInventory.deleteFoodItem(row);
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
            console.log("Foods",foods)
            if(food){
              console.log("BEFORE Response",food)           
             const response = await foodInventory.addFoodItem(food);
                console.log("After Response",response)
                if(response){
                openSnackBar("Item Added Successfully", success);
                setLoading(true);
               fetchFoods()
              }else {
                alert("Bad Request")
              }
            }
            console.log("Food",food)
    }
    return (
        <div>
        <DialogTitle><FastfoodIcon/>Add Food</DialogTitle>
        <DialogContent className={classes.roomsDiv}>
        <form className={classes.formGroup} autoComplete="off">
          <TextField required id="standard-required" label="Item" name="season" value={food.item} variant="outlined"
          onChange={(event)=>setFood({...food,item: event.target.value})} />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Unit</InputLabel>
              <Select
               labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={unit}
                onChange={handleChange}
                required
              >
                      <MenuItem value="KG">KG</MenuItem>
                      <MenuItem value="GRAM">GRAM</MenuItem>
                      <MenuItem value="LTR">LTR</MenuItem>
                      <MenuItem value="ML">ML</MenuItem>
                      <MenuItem value="PIECE">PIECE</MenuItem>
                      <MenuItem value="PORTION">PORTION</MenuItem>
                      <MenuItem value="BOX">BOX</MenuItem>

                     </Select>
            </FormControl>
          <TextField required id="standard-required" label="Price" name="season"
          value={food.price}variant="outlined"
          onChange={(event)=>setFood({...food,price: event.target.value})}/>
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
              {foods.map((row,i) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {i+1}
                  </TableCell>
                  {editingRow._id !== row._id && <TableCell align="center">{row.item}</TableCell>}
                  {editingRow._id === row._id && <TableCell align="center">
                    <TextField required id="standard-required" label="Item" name="item" value={editingRow.item} onChange={handleInputChange}/>
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
                      <MenuItem value="KG">KG</MenuItem>
                      <MenuItem value="GRAM">GRAM</MenuItem>
                      <MenuItem value="LTR">LTR</MenuItem>
                      <MenuItem value="ML">ML</MenuItem>
                      <MenuItem value="PIECE">PIECE</MenuItem>
                      <MenuItem value="PORTION">PORTION</MenuItem>
                      <MenuItem value="BOX">BOX</MenuItem>
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

export default FoodInventory
